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
                const filterFunc = (item, array) => {
                  return !array.includes(item);
                };

                const filterWords = ["none", "ноне", "не", "звонить", "вход", "ватсап", "ватсапа", "телеграм", "телеграма", "только", "возможно", "номер"];
                const filterRoles = ["ученик", "ученица", "у", "уч", "сын", `дочь`, "ребенок", "ребёнок"];
                const filterFamily = ["папа", "мама", "родитель", "дедушка", "бабушка", "опекун", "родитель"];
                const names = ["агафя", "аксиня", "анися", "даря", "лукеря", "наталя", "прасковя", "софя"];
                const namePupil = jsonObj.name;
                let cleanedNamePupil = namePupil
                  .replace(/\s*\([^)]*\)/, "")
                  .replace(/[^a-zA-Zа-яА-Я0-9]+/g, " ")
                  .replace(/\s+/g, " ")
                  .trim()
                  .toLowerCase()
                  .split(" ")
                  .map(item => (/^[a-zA-Z]*$/.test(item)) ? cyrillicToTranslit().reverse(item, " ") : item)
                  .map(item => names.includes(item) ? item.replace("я", "ья") : item)
                  .filter(item => filterFunc(item, filterWords));
                console.log(cleanedNamePupil);
                if (cleanedNamePupil.some(item => filterFamily.includes(item))) {
                  const index = cleanedNamePupil.indexOf(cleanedNamePupil.filter(item => filterFamily.includes(item)).toString());
                  if (filterRoles.includes(cleanedNamePupil[0])) {
                    console.log(`Первый сценарий - вначале слово ученик, удаляется все после имени`);
                    cleanedNamePupil.splice(2, cleanedNamePupil.length - 2);
                    cleanedNamePupil = cleanedNamePupil.filter(item => filterFunc(item, filterRoles));
                  } else if (filterRoles.includes(cleanedNamePupil[index + 1])) {
                    console.log(`Второй сценарий - есть кто-то из семьи, удаляется все, что слева, т.к. после семьи сразу идет "ученик"`);
                    cleanedNamePupil.splice(0, index + 2);
                  } else {
                    console.log(`Третий сценарий - проверяем наличие слова ученик и т д`);
                    const indexRole = cleanedNamePupil.indexOf(cleanedNamePupil.filter(item => filterRoles.includes(item)).toString());
                    if (indexRole !== -1) {
                      console.log(`есть ролевое слово - удаляем все, включая ролевое слово`);
                      cleanedNamePupil.splice(index, indexRole + 1);
                    } else if (index !== 0) {
                      console.log(`Сначала идет имя ученика, потом родитель, удаляем все с родителем`);
                      cleanedNamePupil.splice(index, cleanedNamePupil.length - index);
                    } else {
                      console.log(`упоминания ученика нет - удаляем все`);
                      cleanedNamePupil = [];
                    }
                  }
                } else {
                  cleanedNamePupil.splice(1, cleanedNamePupil.length - 1);
                }
                let upperCleanedNamePupil = cleanedNamePupil
                  .filter(item => filterFunc(item, filterRoles))
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ");
                lessonInfo.namePupil = upperCleanedNamePupil;
                lessonInfo.idPupil = jsonObj.additional_id;
              }
            });
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
                    if (key === "состояние" || key === "вводный урок" || key === "ставка урока" || key === "назначенное время") {
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




