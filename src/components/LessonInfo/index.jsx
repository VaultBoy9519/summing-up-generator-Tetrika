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
    console.log(`Форма`);
    console.log(formState);
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


