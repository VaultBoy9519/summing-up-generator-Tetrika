import "./App.css";
import Header from "./components/Header";
import OptionalRecs from "./components/OptionalRecs";
import ResumeField from "./components/ResumeField";
import React from "react";
import { finishFragmentMessage, messages } from "./objects/messages";
import { statusInfoPupil, statusInfoTutor } from "./objects/statusInfo";
import LessonInfo from "./components/LessonInfo";
import AppContext from "./components/AppContext";

function App() {

  const [messageToPupil, setMessageToPupil] = React.useState("");
  const [messageToTutor, setMessageToTutor] = React.useState("");
  const [optRecs, setOptRecs] = React.useState({});
  const [lesson, setLesson] = React.useState({});
  const [color, setColor] = React.useState({});
  const [renew, setRenew] = React.useState(true);

  //Колбэки для получения пропсов из LessonInfo
  const onCreateLesson = (formValues, colorForms) => {
    setLesson(formValues);
    setColor(colorForms);
  };

  //три функции ниже отвечают за ререндер при нажатии кнопки
  //"Создать", если кто-то хочет вернуть данные после изменений
  const checkRenew = (message, messageText) => {
    setRenew(false);
  };

  const renewMessagePupil = (message, messageText) => {
    checkRenew(message, messageText);
  };
  const renewMessageTutor = (message, messageText) => {
    checkRenew(message, messageText);
  };

  //Колбэк для получения пропса из OptionalRecs
  const onCheckOptRecs = (checkboxValues) => {
    setOptRecs(checkboxValues);
  };

  //отвечает за раскрашивание input-линий
  const highlightInput = () => {
    for (let name of arrNullValues) {
      setColor(prevState => ({ ...prevState, [name]: "yellow" }));
      setTimeout(
        () => (setColor(prevState => ({ ...prevState, [name]: "white" }))),
        800
      );
    }
  };

  let tutorFullName = [];
  let statusFragment = ["", ""];

  //функция отвечает только за создание фрагмента со статусом урока
  const createStatusMessage = () => {

    //Преобразование даты и времени в корректный формат
    const dayOfWeek = ["понедельник", "вторник", "среда", "четверг", "пятница", "суббота", "воскресенье"];
    const adminkaDateLesson = lesson.dateLesson.split(" ").filter((n) => {
      return !dayOfWeek.includes(n.replace(",", ""));
    });
    const dateAndTime = `${parseInt(adminkaDateLesson[1], 10)} ${adminkaDateLesson[2]} в ${adminkaDateLesson[0]}`;
    if (lesson.nameTutor !== undefined) {
      tutorFullName = lesson.nameTutor.split(" ");
    }

    //Функция выполняется в следующей, безымянной. Нужна для формирования полного фрагмента после установки статуса
    const setStatusLessonMessage = (pupilMessage, tutorMessage) => {
      const startInfoPupil = `\n\nУрок, назначенный на ${dateAndTime} по Мск (преподаватель ${tutorFullName[0]} ${tutorFullName[1]}), `;
      const startInfoTutor = `\n\nУрок, назначенный на ${dateAndTime} по Мск (ученик ${lesson.namePupil} ${lesson.idPupil}), `;
      return statusFragment = [`${startInfoPupil}${pupilMessage}`,
        `${startInfoTutor}${tutorMessage}`];
    };

    //Функция в зависимости от цифры-значения в статусе урока создает сообщение по статусу
    (() => {
      const keysPupil = Object.keys(statusInfoPupil);
      const keysTutor = Object.keys(statusInfoTutor);
      for (let numberStatus = 0; numberStatus <= keysPupil.length; numberStatus++) {
        if (numberStatus === (Number(lesson.statusLesson) - 1)) {
          const statusPupilValue = statusInfoPupil[keysPupil[numberStatus]];
          const statusTutorValue = statusInfoTutor[keysTutor[numberStatus]];
          return setStatusLessonMessage(statusPupilValue, statusTutorValue);
        }
      }
    })();
  };

  //функция формирует полное сообщение со статусом урока и всеми рекомендациями
  //в зависимости от роли получателя (Tutor/Pupil)
  const createFullMessage = (roleUser) => {
    const optRecsKeys = Object.keys(optRecs).filter(key => key.includes(roleUser));
    const messagesKeys = Object.keys(messages);
    const arrMessage = [];
    for (let i = 0; i < optRecsKeys.length - 1; i++) {
      const messageRecs = messages[messagesKeys[i]];
      if (optRecs[optRecsKeys[i]] === true) {
        if (Array.isArray(messageRecs)) {
          if (roleUser === "Pupil") {
            arrMessage.push(statusFragment[0]);
            arrMessage.push(messageRecs[1]);
          } else {
            arrMessage.push(messageRecs[0]);
            arrMessage.push(statusFragment[1]);
          }
        } else {
          arrMessage.push(messageRecs);
        }
      }
    }
    //Добавление фрагмента статуса урока, если он не был добавлен вместе с компенсом/ОНП
    if (!arrMessage.includes(statusFragment[0]) && !arrMessage.includes(statusFragment[1])) {
      roleUser === "Pupil" ?
        arrMessage.push(statusFragment[0]) :
        arrMessage.push(statusFragment[1]);
    }
    return (`Здравствуйте, ${
      roleUser === "Pupil" ?
        lesson.namePupil :
        tutorFullName[0]
    }. Техподдержка Тетрики снова на связи!${arrMessage.join("")}\n\n${
      optRecs[optRecsKeys[optRecsKeys.length - 1]] === false ?
        finishFragmentMessage.summarizingMessage :
        finishFragmentMessage.noCallMessage
    }`);
  };

  let arrNullValues = [];

  //функция вызывается при нажатии кнопки "Создать"
  const generateSummary = () => {

    //Если есть незаполненные input, названия добавляются в массив
    for (let name in lesson) {
      if (lesson[name] === "") {
        if (!arrNullValues.includes(name)) {
          arrNullValues.push(name);
        }
      }
    }

    //в случае, если массив не пустой, input с соответствующим
    //названием подсвечивается желтым и функция завершается, иначе формируется сообщение
    //со статусом урока
    if (arrNullValues.length > 0) {
      highlightInput();
      return;
    } else {
      createStatusMessage();
      setMessageToPupil(createFullMessage("Pupil"));
      setMessageToTutor(createFullMessage("Tutor"));
      setRenew(true);
    }
  };

  const setCheckReset = () => {
    const reset = (obj, setObj, value) => {
      let reset = {};
      for (let element in obj) {
        reset[element] = value;
        setObj(reset);
      }
    };
    reset(lesson, setLesson, "");
    reset(optRecs, setOptRecs, false);
    setMessageToPupil("");
    setMessageToTutor("");
  };


  // const handleClick = () => {
  //   window.addEventListener("message", function(event) {
  //     if (event.data.type === "GET_DATA_RESPONSE") {
  //       console.log("Response from extension:", event.data.response);
  //     }
  //   });
  //   window.postMessage({ type: "GET_DATA" }, "*");
  // };

  const handleClick = () => {
    window.postMessage(
      {
        type: "FROM_PAGE",
        data: {}
      },
      "*"
    );
  };

  window.addEventListener("message", (event) => {
    if (event.source !== window) {
      return;
    }

    if (event.data.type !== "FROM_CONTENT") {
      return;
    }

    console.log("Response from extension:", event.data.data);
    setLesson(event.data.data);
  });

// Запрос загрузки контентного скрипта
  window.postMessage({ type: "LOAD_CONTENT_SCRIPT" }, "*");


  //автозаполнение объекта с инфой об уроке
  const createNames = () => {
    // const obj = {
    //   dateLesson: `18:00 четверг, 01 февраля`,
    //   nameTutor: `Тест Тестович Тетрилин`,
    //   idPupil: `Ливерная Голубка 14`,
    //   namePupil: `Тест Ева`,
    //   statusLesson: "1"
    // };
    // setLesson(obj);
    handleClick();
  };


  return (
    <AppContext.Provider value={{ color, optRecs, lesson }}>
      <div className="App">
        <Header />
        <div>
          <div className="container">
            <div className="row">
              <div className="col-lg-4">
                <div className="row">
                  <div className="col-lg-12 elementMargin">
                    <LessonInfo onCreateLesson={(formValues, colorForms) => onCreateLesson(formValues, colorForms)}
                                arrNullValues={arrNullValues}
                    />
                  </div>
                  <div className="col-lg-12">
                    <OptionalRecs onCheckOptRecs={checkboxValues => onCheckOptRecs(checkboxValues)}
                                  optRecs={optRecs} />
                  </div>
                </div>
              </div>
              <div className="col-lg-8">
                <div className="row">
                  <div className="col-lg-12">
                    <ResumeField
                      userRole={"ученика"}
                      message={messageToPupil}
                      renewMessage={(message, messageText) => renewMessagePupil(message, messageText)}
                      renew={renew}
                    />
                  </div>
                  <div className="col-lg-12">
                    <ResumeField
                      userRole={"преподавателя"}
                      message={messageToTutor}
                      renewMessage={(message, messageText) => renewMessageTutor(message, messageText)}
                      renew={renew}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="button-div">
          <button type="button" className="btn btn-secondary bg-gradient btn-lg w-200 mx-auto mx-lg-0 mt-10"
                  onClick={generateSummary}>Создать
          </button>
          <button type="button"
                  className="btn btn-secondary bg-gradient btn-lg mx-auto mx-lg-0 mt-10 ml-10"
                  onClick={setCheckReset}>Очистить
          </button>
          <button type="button"
                  style={{ display: "inline-block" }}
                  className="btn btn-primary btn-lg mx-auto mx-lg-0 mt-10 ml-10"
                  onClick={createNames}>Тест
          </button>
        </div>
        <div>
          <div className="versionText">
            Создал VaultBoy для ТП Тетрики, (v1.0, 03.05.2023).
          </div>
        </div>
      </div>
    </AppContext.Provider>
  );
}

export default App;
