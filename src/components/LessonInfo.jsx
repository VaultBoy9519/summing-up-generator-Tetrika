import React from "react";

const LessonInfo = (props) => {

  const [formValues, setFormValues] = React.useState({
    dateLessonInput: "",
    nameTutorInput: "",
    namePupilInput: "",
    idPupilInput: "",
    statusLessonToggle: ""
  });

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    setFormValues({ ...formValues, [name]: value });
  };

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
          <input className="form-control" name="dateLessonInput" placeholder="Дата и время урока"
                 onChange={handleInputChange} />
        </p>
        <p>
          <input className="form-control" name="nameTutorInput" placeholder="ИО преподавателя"
                 onChange={handleInputChange} />
        </p>
        <p className="d-flex">
          <input className="form-control" name="namePupilInput" placeholder="Имя ученика"
                 onChange={handleInputChange} />
          <input className="form-control ml-15" name="idPupilInput" placeholder="ID ученика"
                 onChange={handleInputChange} />
        </p>
        <p>
          <select className="form-select" name="statusLessonToggle" aria-label="statusLessonToggle"
                  onChange={handleInputChange}>
            <option selected>Статус урока</option>
            <option value={1}>Неявка У (РУ)</option>
            <option value={2}>Неявка У (ВУ)</option>
            <option value={3}>Неявка П (РУ)</option>
            <option value={4}>Неявка П (ВУ)</option>
            <option value={5}>Отмена (ВНН)</option>
            <option value={6}>Отмена (ТПсДС)</option>
          </select>
        </p>
      </ul>
    </div>
  );
};

export default LessonInfo;


