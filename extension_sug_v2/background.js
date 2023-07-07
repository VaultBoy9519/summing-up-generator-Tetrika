chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  const getHrefId = (selector, doc) => {
    return doc.querySelector(`a[href^='${selector}']`)
      .getAttribute("href")
      .replace(`${selector}`, "");
  };

  const getDocumentHtml = (link) => {

    const docCreator = (html) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      return doc;
    };

    try {
      return fetch(link)
        .then(r => {
          if (r.status == 403) {
            console.log(`Ошибка 403`);
            return fetch("https://tetrika-school.ru/go_back")
              .then(() => {
                console.log(`Повторный запрос`);
                return fetch(link);
              }).then(r => r.text())
              .then(html => docCreator(html));
          }
          return r.text().then(html => docCreator(html));
        });
    } catch (error) {
      console.log(`Урок не найден`);
      return error;
    }
  };

  switch (request.type) {

    case "FROM_CONTENT": {
      let dataLink;
      if (request.data.link.includes(`tetrika-school.ru`)) {
        dataLink = request.data.link;
      } else {
        dataLink = `https://tetrika-school.ru/adminka/lessons/${request.data.link}`;
      }


      const createLessonInfo = new Promise((resolve, reject) => {
        chrome.cookies.get({ url: "https://tetrika-school.ru", name: "login" }, (cookie) => {
          if (cookie) {
            const lessonInfo = {};
            const linkLogs = `${dataLink}/loki_logs`;
            const linkEvents = `${dataLink}/events`;
            const lessonId = dataLink.includes(`tetrika-school.ru`) ? dataLink.replace("https://tetrika-school.ru/adminka/lessons/", "") : dataLink;
            let lessonDate;

            const standartDateFormat = (date) => {
              const timeZone = moment().utcOffset() / 60;

              const formatDate = moment
                .parseZone(date)
                .utcOffset(timeZone)
                .format("HH:mm:ss D MMM(Z)");
              return formatDate;
            };


            const createUserInfo = async (userId) => {

              await fetch("https://tetrika-school.ru/adminka/users_search/" + userId, { "credentials": "include" })
                .then(r => {
                  return r.json();
                })
                .then(async result => {
                  const json = result.users[0];
                  const userLink = `https://tetrika-school.ru/adminka/${json.role}s/${userId}`;
                  const doc = await getDocumentHtml(userLink);
                  const chatId = getHrefId("/chat/", doc);
                  console.log(chatId);
                  if (json.role === "tutor") {
                    const tutorFullName = json.name.split(" ");
                    const firstElement = tutorFullName.shift();
                    tutorFullName.push(firstElement);
                    lessonInfo.nameTutor = tutorFullName.join(" ");
                    lessonInfo.tutorChat = chatId;
                    lessonInfo.emailTutor = json.email;
                  } else {
                    const namePupil = json.name;
                    lessonInfo.idPupil = json.additional_id;
                    lessonInfo.namePupil = filterNamePupil(namePupil);
                    lessonInfo.pupilChat = chatId;
                    lessonInfo.emailPupil = json.email;
                  }
                });
            };

            getDocumentHtml(dataLink)
              .then(
                async doc => {

                  const generalLessonInfo = {};

                  const createGeneralInfo = async () => {

                    const checkParameter = (key) => {
                      const parameters = ["state", "is_intro", "lesson_rate", "duration", "start_time", "tutor_qualification"];
                      let trigger = false;
                      parameters.forEach(parameter => {
                        if (key === parameter) {
                          trigger = true;
                          return;
                        }
                      });
                      return trigger;
                    };

                    const calendarEvent = getHrefId("/adminka/calendar/", doc);
                    const calendarEventLink = `https://tetrika-school.ru/adminka/calendar/${calendarEvent}`;

                    const eventDoc = await getDocumentHtml(calendarEventLink);

                    if (eventDoc.querySelector("table")) {
                      const table = eventDoc.querySelector("table");
                      const rows = table.querySelectorAll(`tr`);
                      for (let i = 0; i < rows.length; i++) {
                        const cells = rows[i].querySelectorAll("td");
                        const key = cells[0].textContent.trim();
                        if (checkParameter(key)) {
                          let value = cells[1].textContent.trim();
                          if (Number(value)) {
                            value = Number(value).toFixed();
                          }
                          generalLessonInfo[key] = value;
                        }
                      }
                      return;
                    } else {
                      sendResponse(`404 Not Found`);
                      return;
                    }
                  };

                  await createGeneralInfo();

                  lessonInfo.type = generalLessonInfo["is_intro"] === "False" ? "РУ" : "ВУ";
                  lessonInfo.tutorCash = Number(generalLessonInfo["lesson_rate"]);
                  lessonInfo.durationLesson = generalLessonInfo["duration"];
                  lessonInfo.quarks = `${generalLessonInfo["tutor_qualification"]}_${lessonInfo.durationLesson}`;

                  //Функция выбирает статус урока в объект
                  const setStatusLesson = () => {
                    switch (generalLessonInfo["state"]) {
                      case "неявка ученика":
                        if (generalLessonInfo["is_intro"] === "False") {
                          lessonInfo.statusLesson = "1";
                        } else {
                          lessonInfo.statusLesson = "2";
                        }
                        break;
                      case "неявка учителя":
                        if (generalLessonInfo["is_intro"] === "False") {
                          lessonInfo.statusLesson = "3";
                        } else {
                          lessonInfo.statusLesson = "4";
                        }
                        break;
                      case "отменён":
                        lessonInfo.statusLesson = "5";
                        break;
                      default:
                        lessonInfo.statusLesson = "0";
                    }
                  };
                  setStatusLesson();

                  const createUserId = (role) => {
                    const fullLink = doc.querySelector(`a[href*="/adminka/${role}s/"]`).getAttribute("href");
                    const linkSplit = fullLink.split("/");
                    return linkSplit[3];
                  };

                  lessonInfo.fullIdTutor = createUserId("tutor");
                  lessonInfo.fullIdPupil = createUserId("pupil");

                  const dateTime = new Date(generalLessonInfo["start_time"]);
                  const moscowTime = new Date(dateTime.getTime() + 180 * 60 * 1000);
                  lessonDate = moscowTime;
                  const dateLesson = moment(moscowTime.toLocaleString(), "DD.MM.YYYY, HH:mm:ss").format("HH:mm dddd, DD MMMM");

                  lessonInfo.dateLesson = dateLesson;

                  return createUserInfo(lessonInfo.fullIdPupil);
                })
              .then(async () => {
                //Получить журнал урока
                const getItemMarkup = (json) => {
                  const journal = {
                    theme: "",
                    praise: "",
                    attention: "",
                    next_plan: ""
                  };

                  if (json !== null) {
                    for (let key in journal) {
                      journal[key] = json[key];
                    }
                  }

                  return journal;
                };

                fetch(`https://tetrika-school.ru/api/lesson_info/${lessonId}`, { credentials: "include" })
                  .then(r => r.json())
                  .then(r => {
                    lessonInfo.journal = getItemMarkup(r.payload);
                  });

                const tutorEvents = [];
                const pupilEvents = [];

                //Получить и провести анализ событий
                await getDocumentHtml(
                  linkEvents
                )
                  .then(async (doc) => {
                    await eventsParser(
                      doc,
                      tutorEvents,
                      pupilEvents,
                      standartDateFormat
                    );
                  })
                  .catch((error) => {
                    // Обработка ошибки, если что-то пошло не так
                    console.error(error); // Вывод ошибки в консоль
                  });

                //Получить и провести анализ логов
                await getDocumentHtml(linkLogs)
                  .then(async doc => {
                    await logsAnalyzer(
                      doc,
                      lessonDate,
                      lessonInfo,
                      pupilEvents,
                      tutorEvents
                    );
                  });

                //Получить имя админа
                await getDocumentHtml("https://tetrika-school.ru/adminka")
                  .then(async doc => {
                    const header = doc.querySelector("h2").textContent;
                    const headerArr = header.replace(/[^a-zA-Zа-яА-Я0-9]+/g, " ").split(" ");
                    const adminName = `${headerArr[0]} ${headerArr[1]}`;
                    lessonInfo.adminName = adminName;
                  });
              })
              .then(() => {
                return createUserInfo(lessonInfo.fullIdTutor);
              })
              .then(() => {
                console.log(lessonInfo);
                resolve(JSON.stringify(lessonInfo));
              })
              .catch((error) => {
                reject(error);
              });

          } else {
            sendResponse(`Access denied`);
            reject(`Cookie not found`);
          }
        });
      });

      createLessonInfo.then(sendResponse, (error) => {
        console.log(error);
      });
    }
      break;

    case "FROM_CONTENT_COMPENS": {
      //Отправка компенсации П и проверка ее наличия
      const data = request.data;

      const checkCompens = (doc) => {
        const table = doc.querySelector(".table-bordered");
        const rows = table.querySelectorAll("tbody tr");

        let status;

        rows.forEach((row) => {
          const sum = (row.querySelector("td:nth-child(1)").textContent);
          const sumFixed = parseFloat(Number(sum).toFixed(2));
          const comment = row.querySelector("td:nth-child(4)").textContent;
          const adminName = row.querySelector("td:nth-child(5)").textContent;


          if (sumFixed === data.cash && comment === data.comment && adminName === data.adminName) {
            console.log(`Компенсация добавлена успешно`);
            status = true;
          } else {
            console.log(`Компенсация не найдена, ошибка`);
            status = false;
          }
        });
        return status;
      };

      if (data.cash > 0) {
        getDocumentHtml(`https://tetrika-school.ru/adminka/tutors/${data.fullIdTutor}/penalties`)
          .then(doc => {
            if (checkCompens(doc) === true) {
              sendResponse(`Уже выполнен`);
            } else {
              postCompensTutor(data, checkCompens)
                .then(sendResponse, (error) => {
                  console.log(error);
                });
            }
          });
      } else {
        sendResponse(``);
      }
    }
      break;

    case "FROM_CONTENT_POST-MESSAGE": {
      //Отправка сообщения в чат ЛК У или П
      const body = JSON.stringify(request.data);

      const payloadOptions = {
        referrer: "https://tetrika-school.ru/",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: body,
        method: "POST",
        mode: "cors",
        credentials: "include"
      };

      const mmUrl = "https://mmost.tetrika-school.ru/api/v4/posts";

      postMessage(mmUrl, payloadOptions)
        .then(result => {
          const resultObj = {
            status: result,
            user_id: request.data.props.userId
          };
          return resultObj;
        })
        .then(sendResponse, (error) => {
          console.log(error);
        });
    }
      break;

    case "FROM_CONTENT_BL": {
      //Начисление БУ У
      const body = new URLSearchParams(request.data);

      const requestOptions = {
        method: "POST",
        body: body,
        redirect: "follow",
        credentials: "include"
      };

      const pupilUrl = `https://tetrika-school.ru/adminka/pupils/${request.data.pupil_id}/subject_make_payment?price_group=by_admin&subject=&tutor_qualification=&duration=`;

      postMessage(pupilUrl, requestOptions)
        .then(sendResponse, (error) => {
          console.log(error);
        });
    }
      break;
    default:
      return;
  }

  return true; // Возвращаем true для указания на то, что мы будем отправлять ответ асинхронно
});