import React from "react";

const LessonInfo = ({ onCreateLesson, color }) => {
  const formState = {};
  const formColor = {};
  const [formValues, setFormValues] = React.useState(formState);
  const [colorForms] = React.useState(formColor);


  const handleInputChange = (event) => {
    const value = event.target.value;
    const name = event.target.name;
    setFormValues({ ...formValues, [name]: value });
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

  return (
    <div>
      <ul>
        <p className="lessonInfo">
          Информация об уроке
        </p>
        <p>
          <input className="form-control"
                 style={{ backgroundColor: color.dateLesson }}
                 name="dateLesson"
                 placeholder={color.dateLesson === "white" ? "Дата и время урока (как в админке)" : "Введите значение"}
                 onChange={handleInputChange} />
        </p>
        <p>
          <input className="form-control"
                 style={{ backgroundColor: color.nameTutor }}
                 name="nameTutor"
                 placeholder={color.nameTutor === "white" ? "ФИО преподавателя (полностью)" : "Введите значение"}
                 onChange={handleInputChange} />
        </p>
        <p className="d-flex">
          <input className="form-control"
                 style={{ backgroundColor: color.namePupil }}
                 name="namePupil"
                 placeholder={color.namePupil === "white" ? "Имя ученика" : "Введите значение"}
                 onChange={handleInputChange} />
          <input className="form-control ml-15"
                 style={{ backgroundColor: color.idPupil }}
                 name="idPupil"
                 placeholder={color.idPupil === "white" ? "ID ученика" : "Введите значение"}
                 onChange={handleInputChange} />
        </p>
        <p>
          <select className="form-select" name="statusLesson" aria-label="statusLessonToggle"
                  onChange={handleInputChange}>
            <option selected>Статус урока</option>
            <option value={1}>Неявка У (РУ)</option>
            <option value={2}>Неявка У (ВУ)</option>
            <option value={3}>Неявка П (РУ)</option>
            <option value={4}>Неявка П (ВУ)</option>
            <option value={5}>Отмена (ВНН)</option>
            <option value={6}>Отмена (ТПсДС)</option>
            <option value={7}>Отмена + компенс</option>
            <option value={8}>Завершено</option>
          </select>
        </p>
      </ul>
    </div>
  );
};

export default LessonInfo;


