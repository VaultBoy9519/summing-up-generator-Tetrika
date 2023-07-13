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
            console.log("Старт");
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


                    try {
                      const calendarEvent = getHrefId("/adminka/calendar/", doc);

                      const calendarEventLink = `https://tetrika-school.ru/adminka/calendar/${calendarEvent}`;

                      lessonInfo.eventId = calendarEvent;

                      const eventDoc = await getDocumentHtml(calendarEventLink);

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
                    } catch (error) {
                      console.log(error);
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
                    lessonInfo.statusName = generalLessonInfo["state"];
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
        .then(result => {
          return result.status;
        })
        .then(sendResponse, (error) => {
          console.log(error);
        });
    }
      break;

    case "FROM_CONTENT_COMPENS": {

      //Отправка компенсации П
      const data = request.data;

      const params = {
        charge: data.cash,
        reason: data.comment,
        additional_info: data.adminName,
        event_id: "",
        lesson_id: data.lessonId,
        action: "new_penalty"
      };

      const requestBody = new URLSearchParams(params);

      const payloadOptions = {
        credentials: "include",
        method: "POST",
        body: requestBody,
        redirect: "follow"
      };

      const url = `https://tetrika-school.ru/adminka/tutors/${data.fullIdTutor}/penalties`;

      postMessage(url, payloadOptions)
        .then(result => {
          return result.status;
        })
        .then(sendResponse, (error) => {
          console.log(error);
        });
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

      const result = {};

      const sendMessage = () => {
        postMessage(mmUrl, payloadOptions)
          .then(response => {
            result.status = response.status;
            console.log(response);
            return response.json();
          })
          .then(json => {
              console.log(json);
              result.message_id = json.id;
              result.user_id = request.data.props.userId;
              return result;
            }
          )
          .then(sendResponse, (error) => {
            console.log(error);
          });
      };

      if (request.data.message_id !== "") {

        const messageUrl = `${mmUrl}/${request.data.message_id}`;

        const deletePayload = {
          method: "DELETE",
          body: new URLSearchParams(),
          redirect: "follow",
          credentials: "include"
        };

        postMessage(messageUrl, deletePayload)
          .then(r => r.status)
          .then(status => {
            if (status >= 400) {
              result.status = status;
              result.message_id = request.data.message_id;
              result.user_id = request.data.props.userId;
              sendResponse(result);
            } else {
              sendMessage();
            }
          });
      } else {
        sendMessage();
      }
    }
      break;

    case "FROM_CONTENT_CANCEL": {

      const data = request.data;
      console.log(data);

      const createRequestOpt = (action) => {

        const params = {
          action: action,
          event_id: data.event_id,
          redirect_to: `/adminka/lessons/${data.lesson_id}`,
          cancel_state: action === "cancelled" ? "cancel" : "finish"
        };

        const body = new URLSearchParams(params);

        const requestOptions = {
          method: "POST",
          body: body,
          redirect: "follow",
          credentials: "include"
        };

        return requestOptions;
      };

      const url = `https://tetrika-school.ru/adminka/lessons/${data.lesson_id}`;

      const checkErrors = async (html, status) => {

        const checkStatus = (doc, status) => {
          const table = doc.querySelector("table");
          const tdElements = table.querySelectorAll("td");

          return Array.from(tdElements).some(td => td.innerText.includes(status));

        };

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        console.log(`Проверка: `, (checkStatus(doc, status)));

        if (doc.querySelector(`.text-danger`)) {
          console.log("Ошибка - урок включен в оплату");
          return 333;
        } else if (checkStatus(doc, status)) {
          console.log(`Статус ${status} успешно установлен`);
          return 200;
        } else {
          console.log(`Не удалось выставить статус ${status}`);
          return 400;
        }
      };

      const setLessonStatus = () => {
        postMessage(url, createRequestOpt("cancelled"))
          .then(result => result.text())
          .then(html => {
            return checkErrors(html, "отменено");
          })
          .then(sendResponse, (error) => {
            console.log(error);
          });
      };

      console.log(data.lesson_status);

      if (data.lesson_status !== "завершён" && data.lesson_status !== "отменён") {
        postMessage(url, createRequestOpt("finished"))
          .then(r => r.text())
          .then(html => {
            return checkErrors(html, "закончено");
          })
          .then(status => {
            if (status === 200) {
              setLessonStatus();
            } else {
              sendResponse(status);
            }
          });
      } else if (data.lesson_status !== "отменён") {
        console.log(`Урок в статусе "Завершен", отменяю`);
        setLessonStatus();
      } else {
        console.log("урок отменен изначально");
        sendResponse(250);
      }


    }
      break;

    default:
      return;
  }

  return true;
});