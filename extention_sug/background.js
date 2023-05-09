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

        // const getInfoRoles = (doc) => {
        //   const infoElements = doc.querySelectorAll(".badge-secondary.js-copy-btn");
        //   const infoText = Array.prototype.map.call(infoElements, (element) => element.textContent.trim());
        //   console.log(`Инфо элементы`, infoText);
        //   return infoText;
        // };

        const jsonUserCreator = (document, emailUser) => {

          const userID = document.querySelector(".badge-secondary.js-copy-btn").textContent.trim();
          fetch("https://tetrika-school.ru/adminka/users_search/" + userID, { "credentials": "include" })
            .then(r => {
              if (r.status == 403) {
                return fetch("https://tetrika-school.ru/go_back", { "credentials": "include" })
                  .then(() => {
                    return fetch("https://tetrika-school.ru/adminka/users_search/" + userID, {
                      "credentials": "include"
                    }).then(r => r.json());
                  });
              }
              return r.json();
            })
            .then(json => {
              const jsonObj = json.users[0];
              lessonInfo[emailUser] = jsonObj.email;
              if (jsonObj.role === "tutor") {
                const tutorFullName = jsonObj.name.split(" ");
                lessonInfo.nameTutor = `${tutorFullName[1]} ${tutorFullName[2]} ${tutorFullName[0]}`;
              } else {
                lessonInfo.namePupil = jsonObj.name;
              }
            });
        };


        getData("https://tetrika-school.ru/adminka/lessons/9c90c0cb-4d50-44c4-9eac-0f8f0a51f425")
          .then(
            doc => {
              //Функция проходит по таблице урока и
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
              console.log(generalLessonInfo);

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

              return getData(linkPupil);
            })

          .then((doc) => {
            // const nameTutor = doc.querySelector(".fio").textContent.trim();
            // lessonInfo.nameTutor = nameTutor;
            jsonUserCreator(doc, "namePupil", "emailPupil");

            // jsonUserCreator(doc, "nameTutor", "emailTutor");
            // const infoTextTutor = getInfoRoles(doc);
            // jsonUserCreator(infoTextTutor[0]);
            // lessonInfo.emailTutor = infoTextTutor[1];
            return getData(linkTutor);
          })
          .then((doc) => {
            jsonUserCreator(doc, "nameTutor", "emailTutor");

            // jsonUserCreator(doc, "namePupil", "emailPupil");
            // const namePupil = doc.querySelector(".badge-info").textContent.substring(5);
            // const infoTextPupil = getInfoRoles(doc);
            // const idPupil = infoTextPupil[3];
            // lessonInfo.namePupil = namePupil;
            // lessonInfo.idPupil = idPupil;
            // lessonInfo.emailPupil = infoTextPupil[2];
            resolve(lessonInfo);
          })
          .catch((error) => {
            reject(error);
          });

      } else {
        reject(`Cookie not found`);
      }
    });
  });

  createLessonInfo.then(sendResponse, (error) => {
    console.log(error);
  });

  // const createLessonInfo = new Promise((resolve, reject) => {
  //   chrome.cookies.get({ url: "https://tetrika-school.ru", name: "login" }, function(cookie) {
  //     if (cookie) {
  //       fetch("https://tetrika-school.ru/adminka/lessons/70be3ed3-a659-4329-b6e0-51d5faf5e5bb", {
  //         headers: {
  //           "Cookie": `login=${cookie.value}`
  //         }
  //       })
  //         .then(response => response.text())
  //         .then(html => {
  //           const parser = new DOMParser();
  //           const doc = parser.parseFromString(html, "text/html");
  //           const dateTimeElement = doc.querySelector(".datetime_me__without-ms");
  //           const linkTutor = `https://tetrika-school.ru${doc.querySelector("a[href*=\"/adminka/tutors/\"]").getAttribute("href")}`;
  //           const linkPupil = `https://tetrika-school.ru${doc.querySelector("a[href*=\"/adminka/pupils/\"]").getAttribute("href")}`;
  //           console.log(linkTutor);
  //           console.log(linkPupil);
  //           if (dateTimeElement) {
  //             const dateTimeText = dateTimeElement.textContent.trim();
  //             const dateTime = new Date(dateTimeText);
  //             const moscowTime = (new Date(dateTime.getTime() + 180 * 60 * 1000)).toLocaleString();
  //             const dateLesson = moment(moscowTime, "DD.MM.YYYY, HH:mm:ss").format("HH:mm dddd, DD MMMM");
  //             const lessonInfo = {};
  //             lessonInfo.dateLesson = dateLesson;
  //             resolve(lessonInfo);
  //           } else {
  //             console.log(`Element not found`);
  //             reject(`Element not found`);
  //           }
  //         });
  //     } else {
  //       console.log(`Cookie not found`);
  //       reject(`Cookie not found`);
  //     }
  //   });
  // });


  return true; // Возвращаем true для указания на то, что мы будем отправлять ответ асинхронно
});


const getData = (link) => {
  return fetch(link)
    .then(response => response.text())
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      return doc;
    });
};

