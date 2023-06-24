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

    if (checkValue("") || checkValue("-")) {
      return "пустой";
    } else {
      return "заполнен";
    }

  };

  return (


    <div className="btn-group mb-10" style={{ minWidth: "100%" }}>
      <div className="btn-group dropstart" role="group">
        <button type="button"
                className={
                  checkJournal() === "заполнен" ?
                    "btn btn-success dropdown-toggle dropdown-toggle-split" :
                    "btn btn-secondary dropdown-toggle dropdown-toggle-split"
                }
                data-bs-toggle="dropdown" aria-expanded="false">
          <span className="visually-hidden">Toggle Dropstart</span>
        </button>
        <ul className="dropdown-menu p-5" style={checkJournal() === "заполнен" ? { width: "400px" } : {}}>
          <li className="ml-10"><b>Занимались: </b><p>{journal && journal.theme}</p>
          </li>
          <li className="ml-10"><b>Получалось: </b><p>{journal && journal.praise}</p></li>
          <li className="ml-10"><b>Приоритеты: </b><p>{journal && journal.attention}</p></li>
          <li className="ml-10"><b>Планы: </b><p>{journal && journal.next_plan}</p></li>
        </ul>
      </div>
      <span className={checkJournal() === "заполнен" ? "btn bg-success" : "btn bg-secondary"}
            style={{ color: "white", cursor: "default" }}>
        Журнал: {checkJournal()}
      </span>
      <span className="btn bg-secondary" style={{ color: "white", cursor: "default" }}>
        {durationLesson ? `${durationLesson} мин.` : `Длина урока`}
      </span>
    </div>
  );
};

export default Journal;