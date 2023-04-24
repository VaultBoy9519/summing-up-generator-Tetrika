import React from "react";

const LessonInfo = () => {
  return (
    <div>
      <ul>
        <p className="lessonInfo">
          Информация об уроке
        </p>
        <p>
          <input className="form-control" id="exampleFormControlInput1" placeholder="Дата и время урока" />
        </p>
        <p>
          <input className="form-control" id="exampleFormControlInput1" placeholder="ИО преподавателя" />
        </p>
        <p className="d-flex">
          <input className="form-control" id="exampleFormControlInput1" placeholder="Имя ученика" />
          <input className="form-control ml-15" id="exampleFormControlInput1" placeholder="ID ученика" />
        </p>
        <p>
          <select className="form-select" aria-label="Пример выбора по умолчанию">
            <option selected>Статус урока</option>
            <option value="1">Неявка У (РУ)</option>
            <option value="2">Неявка У (ВУ)</option>
            <option value="3">Неявка П (РУ)</option>
            <option value="4">Неявка П (ВУ)</option>
            <option value="5">Отмена (ВНН)</option>
            <option value="6">Отмена (ТПсДС)</option>
          </select>
        </p>
      </ul>
    </div>
  );
};

export default LessonInfo;