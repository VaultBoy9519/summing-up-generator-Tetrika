chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type !== "FROM_CONTENT") {
    return;
  }

  const createLessonInfo = new Promise((resolve, reject) => {
    chrome.cookies.get({ url: "https://tetrika-school.ru", name: "login" }, (cookie) => {
      if (cookie) {
        const lessonInfo = {};
        let linkTutor;
        let linkPupil;

        const getDocumentHtml = (link) => {

          const docCreator = (html) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            return doc;
          };

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
              console.log(jsonObj);
              if (jsonObj.role === "tutor") {
                const tutorFullName = jsonObj.name.split(" ");
                const firstElement = tutorFullName.shift();
                tutorFullName.push(firstElement);
                lessonInfo.nameTutor = tutorFullName.join(" ");
              } else {
                const namePupil = jsonObj.name
                  .split(" ")
                  .filter(element => {
                    return element !== "None";
                  })
                  .join(" ");
                lessonInfo.namePupil = namePupil;
                lessonInfo.idPupil = jsonObj.additional_id;
              }
            });
        };

        getDocumentHtml("https://tetrika-school.ru/adminka/lessons/0a47c1e8-0fc5-4e1a-a294-12bdea7ec830")
          .then(
            doc => {
              //Функция проходит по таблице урока и создает объект с нужными параметрами
              //который помещается в generalLessonInfo
              const createGeneralInfo = () => {
                const table = doc.querySelector("table");
                const rows = table.querySelectorAll(`tr`);
                const obj = {};
                for (let i = 0; i < rows.length; i++) {
                  const cells = rows[i].querySelectorAll("td");
                  const key = cells[0].textContent.trim();
                  if (key === "состояние" || key === "вводный урок" || key === "ставка урока" || key === "назначенное время") {
                    let value = cells[1].querySelector("dd").textContent.trim();
                    if (Number(value)) {
                      value = Number(value).toFixed();
                    }
                    obj[key] = value;
                  }
                }
                return obj;
              };

              const generalLessonInfo = createGeneralInfo();

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
                    lessonInfo.statusLesson = "";
                }
              };
              setStatusLesson();

              linkTutor = `https://tetrika-school.ru${doc.querySelector("a[href*=\"/adminka/tutors/\"]").getAttribute("href")}`;
              linkPupil = `https://tetrika-school.ru${doc.querySelector("a[href*=\"/adminka/pupils/\"]").getAttribute("href")}`;

              const dateTime = new Date(generalLessonInfo["назначенное время"]);
              const moscowTime = (new Date(dateTime.getTime() + 180 * 60 * 1000)).toLocaleString();
              const dateLesson = moment(moscowTime, "DD.MM.YYYY, HH:mm:ss").format("HH:mm dddd, DD MMMM");

              lessonInfo.dateLesson = dateLesson;
              lessonInfo.tutorCash = generalLessonInfo["ставка урока"];

              return createUserInfo(linkPupil, "emailPupil");
            })

          .then((doc) => {
            return createUserInfo(linkTutor, "emailTutor");
          })
          .then((doc) => {
            resolve(lessonInfo);
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




