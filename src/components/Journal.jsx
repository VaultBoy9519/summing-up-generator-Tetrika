const Journal = ({ durationLesson, journal }) => {

  const checkJournal = () => {

    const checkValue = (value) => {
      let allKeysValue = true;
      for (let key in journal) {
        if (journal[key] !== value) {
          allKeysValue = false;
          break;
        }
      }
      return allKeysValue;
    };

    if (checkValue("")) {
      return "пустой";
    } else if (checkValue("-")) {
      return "прочерки";
    } else {
      return "заполнен";
    }

  };

  return (


    <div className="btn-group mb-10" style={{ minWidth: "100%" }}>
      <div className="btn-group dropstart" role="group">
        <button type="button" className="btn btn-secondary dropdown-toggle dropdown-toggle-split"
                data-bs-toggle="dropdown" aria-expanded="false">
          <span className="visually-hidden">Toggle Dropstart</span>
        </button>
        <ul className="dropdown-menu">
          <li><a className="dropdown-item" href="#">Действие</a></li>
          <li><a className="dropdown-item" href="#">Другое действие</a></li>
          <li><a className="dropdown-item" href="#">Что-то еще здесь</a></li>
        </ul>
      </div>
      <span className="btn bg-secondary" style={{ color: "white" }}>
        Журнал: {checkJournal()}
      </span>
      <span className="btn bg-secondary" style={{ color: "white" }}>
        {durationLesson ? `${durationLesson} мин.` : `Длина урока`}
      </span>
    </div>
  );
};

export default Journal;