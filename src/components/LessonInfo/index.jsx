import React from "react";
import InputForm from "./InputForm";
import AppContext from "../AppContext";

const LessonInfo = ({ onCreateLesson }) => {
  const formState = {};
  const formColor = {};
  const [formValues, setFormValues] = React.useState(formState);
  const [colorForms] = React.useState(formColor);

  const { color, lesson } = React.useContext(AppContext);

  const handleInputChange = (event) => {
    const value = event.target.value;
    const name = event.target.name;
    console.log(formValues);
    setFormValues({ ...lesson, [name]: value });
  };

  React.useEffect(() => {
    const elements = document.getElementsByClassName("form-control");
    for (let element of elements) {
      formColor[element.name] = "white";
      formState[element.name] = "";
    }
  }, []);

  React.useEffect(() => {
    onCreateLesson(formValues, colorForms);
  }, [formValues, colorForms]);

  const formSelectArr = [
    "Неявка У (РУ)",
    "Неявка У (ВУ)",
    "Неявка П (РУ)",
    "Неявка П (ВУ)",
    "Отмена (ВНН)",
    "Отмена (ТПсДС)",
    "Отмена + компенс",
    "Завершено"
  ];


  const formSelectedCreate = formSelectArr.map((form, index) => {
    return <option key={index + 1} value={index + 1}>{formSelectArr[index]}</option>
      ;
  });

  return (
    <AppContext.Provider value={{ color, lesson, handleInputChange }}>
      <div>
        <div className="lessonInfo">
          Информация об уроке
        </div>

        <InputForm nameInput={"dateLesson"}
                   text={"Дата и время урока (как в админке)"}
                   handleInputChange={handleInputChange} />
        <InputForm nameInput={"nameTutor"}
                   text={"ФИО преподавателя (полностью)"}
                   handleInputChange={handleInputChange} />
        <div className="d-flex margin flex">
          <InputForm nameInput={"namePupil"}
                     text={"Имя ученика"}
                     handleInputChange={handleInputChange} />
          <InputForm nameInput={"idPupil"}
                     text={"ID ученика"}
                     handleInputChange={handleInputChange} />
        </div>

        <div>
          <select className="form-select" value={lesson.statusLesson} name="statusLesson"
                  onChange={handleInputChange}>
            <option value="">Выбрать статус урока</option>
            {formSelectedCreate}
          </select>
        </div>
      </div>
    </AppContext.Provider>
  );
};

export default LessonInfo;


// const createLessonInfo = new Promise((resolve, reject) => {
//   chrome.cookies.get({ url: "https://tetrika-school.ru", name: "login" }, (cookie) => {
//     if (cookie) {
//       getData(cookie, "https://tetrika-school.ru/adminka/lessons/70be3ed3-a659-4329-b6e0-51d5faf5e5bb")
//         .then((doc) => {
//           const lessonInfo = {};
//           const dateTimeElement = doc.querySelector(".datetime_me__without-ms");
//           const linkTutor = `https://tetrika-school.ru${doc.querySelector("a[href*=\"/adminka/tutors/\"]").getAttribute("href")}`;
//           const linkPupil = `https://tetrika-school.ru${doc.querySelector("a[href*=\"/adminka/pupils/\"]").getAttribute("href")}`;
//           if (dateTimeElement) {
//             const dateTimeText = dateTimeElement.textContent.trim();
//             const dateTime = new Date(dateTimeText);
//             const moscowTime = (new Date(dateTime.getTime() + 180 * 60 * 1000)).toLocaleString();
//             const dateLesson = moment(moscowTime, "DD.MM.YYYY, HH:mm:ss").format("HH:mm dddd, DD MMMM");
//             lessonInfo.dateLesson = dateLesson;
//           } else {
//             reject(`dateTimeElement not found`);
//           }
//
//           // Вызываем getData еще раз здесь
//           return getData(cookie, linkTutor);
//         })
//         .then((doc) => {
//           // Обработка результата getData
//           // Добавляем информацию в lessonInfo
//           lessonInfo.tutorName = doc.querySelector(".name-block__full-name").textContent.trim();
//           lessonInfo.tutorLink = linkTutor;
//
//           // Вызываем getData еще раз здесь
//           return getData(cookie, linkPupil);
//         })
//         .then((doc) => {
//           // Обработка результата getData
//           // Добавляем информацию в lessonInfo
//           lessonInfo.pupilName = doc.querySelector(".name-block__full-name").textContent.trim();
//           lessonInfo.pupilLink = linkPupil;
//
//           // Возвращаем lessonInfo в цепочку промисов
//           resolve(lessonInfo);
//         })
//         .catch((error) => {
//           reject(error);
//         });
//     } else {
//       reject(`Cookie not found`);
//     }
//   });
// });
