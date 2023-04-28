import React from "react";

const LessonInfo = (props) => {
  const formState = {};
  const [formValues, setFormValues] = React.useState(formState);

  const handleInputChange = (event) => {
    const value = event.target.value;
    const name = event.target.name;

    setFormValues({ ...formValues, [name]: value });
    console.log(formValues);
  };

  React.useEffect(() => {
    const elements = document.getElementsByClassName("form-control");
    for (let element of elements) {
      formState[element.name] = "";
    }
  }, []);

  React.useEffect(() => {
    props.onCreateLesson(formValues);
  }, [formValues]);

  return (
    <div>
      <ul>
        <p className="lessonInfo">
          Информация об уроке
        </p>
        <p>
          <input className="form-control" name="dateLesson" placeholder="Дата и время урока (как в админке)"
                 onChange={handleInputChange} />
        </p>
        <p>
          <input className="form-control" name="nameTutor" placeholder="ФИО преподавателя (полностью)"
                 onChange={handleInputChange} />
        </p>
        <p className="d-flex">
          <input className="form-control" name="namePupil" placeholder="Имя ученика"
                 onChange={handleInputChange} />
          <input className="form-control ml-15" name="idPupil" placeholder="ID ученика"
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
          </select>
        </p>
      </ul>
    </div>
  );
};

export default LessonInfo;


