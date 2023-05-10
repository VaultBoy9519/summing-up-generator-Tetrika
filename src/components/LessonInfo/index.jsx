import React from "react";
import InputForm from "./InputForm";
import AppContext from "../AppContext";

const LessonInfo = ({ onCreateLesson }) => {
  const formState = {};
  const formColor = {};
  const [formValues, setFormValues] = React.useState(formState);
  const [lessonLink, setLessonLink] = React.useState("");
  const [colorForms] = React.useState(formColor);
  const [firstRender, setFirstRender] = React.useState(true);
  const { color, lesson, link, colorLink } = React.useContext(AppContext);

  const handleInputChange = (event) => {
    const value = event.target.value;
    const name = event.target.name;
    setFormValues({ ...lesson, [name]: value });
  };

  React.useEffect(() => {
    setFirstRender(false);
    const elements = document.getElementsByClassName("lesson-input");
    for (let element of elements) {
      formColor[element.name] = "white";
      formState[element.name] = "";
    }
  }, []);

  React.useEffect(() => {
    onCreateLesson(formValues, colorForms, lessonLink);
  }, [formValues, colorForms, lessonLink]);

  const formSelectArr = [
    "Выбрать статус урока",
    "Неявка У (РУ)",
    "Неявка У (ВУ)",
    "Неявка П (РУ)",
    "Неявка П (ВУ)",
    "Отмена (ВНН)",
    "Отмена (ТПсДС)",
    "Отмена + компенс",
    "Завершено"
  ];

  React.useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
      return;
    }
    if (link === "") {
      setLessonLink(link);
    }
  }, [link, firstRender]);

  React.useEffect(() => {
    if (lesson !== formValues) {
      setFormValues(lesson);
    }
  }, [lessonLink, firstRender]);


  const formSelectedCreate = formSelectArr.map((form, index) => {
    return <option key={index} value={index}>{formSelectArr[index]}</option>
      ;
  });

  return (
    <AppContext.Provider value={{ color, lesson, colorLink, handleInputChange }}>
      <div>
        <div className="lessonInfo">
          Информация об уроке
        </div>
        <div>
          <input className="form-control input-style"
                 placeholder={colorLink === "white" ? "Ссылка на урок / ID урока" :
                   colorLink === "yellow" ? "Урок не найден, проверьте ссылку или ID" : colorLink === "red" ? "Админка недоступна" :
                     "Требуется авторизация"}
                 style={{ backgroundColor: colorLink }}
                 value={lessonLink || ""}
                 onChange={event => setLessonLink(event.target.value)}
          />
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
            {formSelectedCreate}
          </select>
        </div>
      </div>
    </AppContext.Provider>
  );
};

export default LessonInfo;