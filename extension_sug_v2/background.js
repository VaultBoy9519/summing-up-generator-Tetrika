chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  if (request.type !== "FROM_CONTENT") {
    return;
  }

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
        let linkTutor;
        let linkPupil;
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

        const getDocumentHtml = (link) => {

          const docCreator = (html) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            return doc;
          };

          try {
            return fetch(link)
              .then(response => {
                if (response.status == 403) {
                  console.log(`Ошибка 403`);
                  return fetch("https://tetrika-school.ru/go_back")
                    .then(() => {
                      console.log(`Повторный запрос`);
                      return fetch(link);
                    }).then(response => response.text())
                    .then(html => docCreator(html));
                }
                return response.text().then(html => docCreator(html));
              });
          } catch (error) {
            console.log(`Урок не найден`);
            return error;
          }
        };

        const createUserInfo = async (link, emailUser) => {
          const doc = await getDocumentHtml(link);
          const userID = doc.querySelector(".badge-secondary.js-copy-btn").textContent.trim();
          await fetch("https://tetrika-school.ru/adminka/users_search/" + userID, { "credentials": "include" })
            .then(response => {
              return response.json();
            })
            .then(json => {
              const jsonObj = json.users[0];
              lessonInfo[emailUser] = jsonObj.email;
              if (jsonObj.role === "tutor") {
                const tutorFullName = jsonObj.name.split(" ");
                const firstElement = tutorFullName.shift();
                tutorFullName.push(firstElement);
                lessonInfo.nameTutor = tutorFullName.join(" ");
              } else {
                const namePupil = jsonObj.name;
                // console.log(filterNamePupil(namePupil));
                lessonInfo.namePupil = filterNamePupil(namePupil);
                lessonInfo.idPupil = jsonObj.additional_id;
              }
            });
          const chatLink = `https://tetrika-school.ru${doc.querySelector("a[href^='/chat/']").getAttribute("href")}`;
          if (emailUser.includes("Pupil")) {
            lessonInfo.pupilChat = chatLink;
          } else {
            lessonInfo.tutorChat = chatLink;
          }
        };

        getDocumentHtml(dataLink)
          .then(
            doc => {
              //Функция проходит по таблице урока и создает объект с нужными параметрами
              //который помещается в generalLessonInfo
              const createGeneralInfo = () => {
                if (doc.querySelector("table")) {
                  const table = doc.querySelector("table");
                  const rows = table.querySelectorAll(`tr`);
                  const obj = {};
                  for (let i = 0; i < rows.length; i++) {
                    const cells = rows[i].querySelectorAll("td");
                    const key = cells[0].textContent.trim();
                    if (key === "состояние" || key === "вводный урок" || key === "ставка урока" || key === "длительность" || key === "назначенное время") {
                      let value = cells[1].querySelector("dd").textContent.trim();
                      if (Number(value)) {
                        value = Number(value).toFixed();
                      }
                      obj[key] = value;
                    }
                  }
                  return obj;
                } else {
                  sendResponse(`404 Not Found`);
                  return;
                }
              };

              const generalLessonInfo = createGeneralInfo();

              lessonInfo.type = generalLessonInfo["вводный урок"] === "Нет" ? "РУ" : "ВУ";

              //Функция выбирает статус урока в объект
              const setStatusLesson = () => {
                switch (generalLessonInfo["состояние"]) {
                  case "ученик не пришел или отменил":
                    if (generalLessonInfo["вводный урок"] === "Нет") {
                      lessonInfo.statusLesson = "1";
                    } else {
                      lessonInfo.statusLesson = "2";
                    }
                    break;
                  case "учитель не пришел или отменил":
                    if (generalLessonInfo["вводный урок"] === "Нет") {
                      lessonInfo.statusLesson = "3";
                    } else {
                      lessonInfo.statusLesson = "4";
                    }
                    break;
                  case "отменено":
                    lessonInfo.statusLesson = "5";
                    break;
                  default:
                    lessonInfo.statusLesson = "0";
                }
              };
              setStatusLesson();

              linkTutor = `https://tetrika-school.ru${doc.querySelector("a[href*=\"/adminka/tutors/\"]").getAttribute("href")}`;
              linkPupil = `https://tetrika-school.ru${doc.querySelector("a[href*=\"/adminka/pupils/\"]").getAttribute("href")}`;

              const dateTime = new Date(generalLessonInfo["назначенное время"]);
              const moscowTime = new Date(dateTime.getTime() + 180 * 60 * 1000);
              lessonDate = moscowTime;
              const dateLesson = moment(moscowTime.toLocaleString(), "DD.MM.YYYY, HH:mm:ss").format("HH:mm dddd, DD MMMM");

              lessonInfo.dateLesson = dateLesson;
              lessonInfo.tutorCash = Number(generalLessonInfo["ставка урока"]);
              lessonInfo.durationLesson = generalLessonInfo["длительность"];

              return createUserInfo(linkPupil, "emailPupil");
            })
          .then(async () => {
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

            //Получаем журнал
            fetch(`https://tetrika-school.ru/api/lesson_info/${lessonId}`, { credentials: "include" })
              .then(r => r.json())
              .then(r => {
                lessonInfo.journal = getItemMarkup(r.payload);
              });

            const tutorEvents = [];
            const pupilEvents = [];

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

          })
          .then(() => {
            return createUserInfo(linkTutor, "emailTutor");
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
  return true; // Возвращаем true для указания на то, что мы будем отправлять ответ асинхронно
});




