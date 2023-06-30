import "./App.css";
import Header from "./components/Header";
import OptionalRecs from "./components/OptionalRecs";
import ResumeField from "./components/ResumeField";
import React from "react";
import { finishFragmentMessage, messages } from "./objects/messages";
import { statusInfoPupil, statusInfoTutor } from "./objects/statusInfo";
import LessonInfo from "./components/LessonInfo";
import AppContext from "./components/AppContext";
import { TutorCash } from "./components/TutorCash";
import LogAnalyzer from "./components/LogAnalyzer";
import Journal from "./components/Journal";
import { useMediaQuery } from "@mui/material";


function App() {

  const [messageToPupil, setMessageToPupil] = React.useState("");
  const [messageToTutor, setMessageToTutor] = React.useState("");
  const [optRecs, setOptRecs] = React.useState({});
  const [lesson, setLesson] = React.useState({});
  const [color, setColor] = React.useState({});
  const [renew, setRenew] = React.useState(true);
  const [link, setLink] = React.useState("");
  const [colorLink, setColorLink] = React.useState("white");
  const [emailPupil, setEmailPupil] = React.useState("E-mail");
  const [emailTutor, setEmailTutor] = React.useState("E-mail");
  const [tutorCash, setTutorCash] = React.useState(`0`);
  const [messageCompens, setMessageCompens] = React.useState("");
  const [logsPupil, setLogsPupil] = React.useState({});
  const [logsTutor, setLogsTutor] = React.useState({});

  const isLargeScreen = useMediaQuery("(min-width: 992px)");
  const isSmallScreen = useMediaQuery("(max-width: 991px)");
  const isMobileScreen = useMediaQuery("(max-width: 500px)");

  let halfTimeLesson;
  //Колбэки для получения пропсов из LessonInfo
  const onCreateLesson = (formValues, colorForms, lessonLink) => {
    setLesson(formValues);
    setColor(colorForms);
    setLink(lessonLink);
  };

  //три функции ниже отвечают за ререндер при нажатии кнопки
  //"Создать", если кто-то хочет вернуть данные после изменений
  const checkRenew = () => {
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

  const highlightInputLink = (color, timeout) => {
    setColorLink(color);
    setTimeout(
      () => (setColorLink("white")),
      timeout
    );
  };

  let tutorFullName = [];
  let statusFragment = ["", ""];

  //функция отвечает только за создание фрагмента со статусом урока
  const createStatusMessage = () => {
    let cash = 0;
    //Преобразование даты и времени в корректный формат
    const dayOfWeek = ["понедельник", "вторник", "среда", "четверг", "пятница", "суббота", "воскресенье", "воскресение"];
    const adminkaDateLesson = lesson.dateLesson.split(" ").filter((n) => {
      return !dayOfWeek.includes(n.replace(",", ""));
    });
    const dateAndTime = `${parseInt(adminkaDateLesson[1], 10)} ${adminkaDateLesson[2]} в ${adminkaDateLesson[0]}`;

    const createCompensTutor = () => {
      const formatDate = (date) => {
        return new Date(`2000-01-01T${date}`);
      };
      const lessonDateTime = formatDate(`${adminkaDateLesson[0]}:00`);
      const beginDateTimePupil = formatDate(logsPupil.beginDate);
      const endDateTimePupil = formatDate(logsPupil.endDate);
      const beginDateTimeTutor = formatDate(logsTutor.beginDate);
      const endDateTimeTutor = formatDate(logsTutor.endDate);

      const setCashTime = () => {
        switch (Number(lesson.durationLesson)) {
          case 30:
          case 45:
            return 15;
          case 60:
          case 120:
            return 25;
        }
      };
      const cashTime = setCashTime();

      const setCompensAndMessage = (cash) => {
        setTutorCash(cash);
        setMessageCompens(`Компенсация за отмену урока из-за тех. проблемы ${dateAndTime} (Мск) с ID ${lesson.idPupil}`);
      };

      if (lesson.statusLesson === "1") {
        if (logsPupil.timeCountInLesson !== 0 && logsTutor.timeCountInLesson > cashTime && beginDateTimePupil < endDateTimeTutor) {
          cash = lesson.tutorCash - 125;
          setCompensAndMessage(cash);
        }
      } else if (lesson.statusLesson === "7") {
        if (logsPupil.timeCountInLesson !== 0 && logsTutor.timeCountInLesson > cashTime && beginDateTimePupil < endDateTimeTutor) {
          cash = lesson.tutorCash;
          setCompensAndMessage(cash);
        } else {
          setCompensAndMessage(125);
        }
      }
    };
    createCompensTutor();

    tutorFullName = lesson.nameTutor.split(" ");
    tutorFullName.pop();

    //Функция выполняется в следующей, безымянной. Нужна для формирования полного фрагмента после установки статуса
    const setStatusLessonMessage = (pupilMessage, tutorMessage) => {
      const startInfoPupil = `\n\nУрок, назначенный на ${dateAndTime} по Мск (преподаватель ${tutorFullName.join(" ")}), `;
      const startInfoTutor = `\n\nУрок, назначенный на ${dateAndTime} по Мск (ученик ${lesson.namePupil} ${lesson.idPupil}), `;
      return statusFragment = [`${startInfoPupil}${pupilMessage}`,
        `${startInfoTutor}${tutorMessage}`];
    };

    //Функция в зависимости от цифры-значения в статусе урока создает сообщение по статусу
    (() => {
      const keysPupil = Object.keys(statusInfoPupil);
      const keysTutor = Object.keys(statusInfoTutor());

      console.log(cash);

      for (let numberStatus = 0; numberStatus <= keysPupil.length; numberStatus++) {
        if (numberStatus === (Number(lesson.statusLesson) - 1)) {
          const statusPupilValue = statusInfoPupil[keysPupil[numberStatus]];
          console.log(`tutorCash: `, tutorCash);

          const checkMVU = () => {
            if (emailTutor.includes("tetrika.school")) {
              return "";
            } else {
              return ". За урок вам начислена компенсация";
            }
          };

          const tutorOrMvu = checkMVU();

          const compensMessage = cash === lesson.tutorCash || cash === lesson.tutorCash - 125 ? ` в размере ставки урока` : ``;
          const statusTutorValue = statusInfoTutor(compensMessage, tutorOrMvu)[keysTutor[numberStatus]];
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
        if (Array.isArray(messageRecs) && i === optRecsKeys.length - 2) {
          if (roleUser === "Pupil") {
            arrMessage.push(statusFragment[0]);
            arrMessage.push(messageRecs[1]);
          } else {
            arrMessage.push(messageRecs[0]);
            arrMessage.push(statusFragment[1]);
          }
        } else if (Array.isArray(messageRecs)) {
          if (roleUser === "Pupil") {
            arrMessage.push(messageRecs[1]);
          } else {
            arrMessage.push(messageRecs[0]);
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
        if (name !== "tutorCash" && name !== "emailPupil" && name !== "emailTutor") {
          if (!arrNullValues.includes(name)) {
            arrNullValues.push(name);
          }
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
        if (element === "statusLesson") {
          reset[element] = "0";
        } else {
          reset[element] = value;
        }
      }
      setObj(reset);
    };
    reset(lesson, setLesson, "");
    reset(optRecs, setOptRecs, false);
    setLink("");
    setTutorCash(0);
    setMessageCompens("");
    setMessageToPupil("");
    setMessageToTutor("");
    setEmailPupil("E-mail");
    setEmailTutor("E-mail");
    setLogsPupil({});
    setLogsTutor({});
  };

  React.useEffect(() => {
    let timerId;
    let receivedResponse = false;
    if (link !== "") {
      timerId = setTimeout(() => {
        if (!receivedResponse) {
          highlightInputLink("red", 4000);
          console.log("Ответ не был получен в течение 15 секунд");
          setLink("");
        }
      }, 15000);
      window.postMessage(
        {
          type: "FROM_PAGE",
          data: { link: link }
        },
        "*"
      );
      console.log(`Запрос отправлен`);
    }
    window.addEventListener("message", async (event) => {
      if (event.source !== window) {
        return;
      }
      if (event.data.type !== "FROM_CONTENT") {
        return;
      }
      receivedResponse = true;
      // console.log("Response from extension:", event.data.data);
      const data = await JSON.parse(event.data.data);
      if (typeof data === "object") {
        setLesson(data);
        halfTimeLesson = data.durationLesson / 2;
        setEmailPupil(data.emailPupil);
        setEmailTutor(data.emailTutor);
        setLogsPupil(data.pupilLogs);
        setLogsTutor(data.tutorLogs);

        console.log(data);
      } else if (data === `404 Not Found`) {
        setLink("");
        highlightInputLink("yellow", 3000);
      } else if (data === `Access denied` || data === undefined) {
        setLink("");
        highlightInputLink("orange", 1000);
      }
    });
    return () => {
      clearTimeout(timerId);
    };
  }, [link]);

// Запрос загрузки контентного скрипта
  window.postMessage({ type: "LOAD_CONTENT_SCRIPT" }, "*");


  //автозаполнение объекта с инфой об уроке
  const createNames = () => {
    const obj = {
      dateLesson: `18:00 четверг, 01 февраля`,
      nameTutor: `Тест Тестович Тетрилин`,
      idPupil: `Ливерная Голубка 14`,
      namePupil: `Тест Ева`,
      statusLesson: "1"
    };
    setLesson(obj);
    console.log(lesson);
  };


  return (
    <AppContext.Provider value={{ color, optRecs, lesson, link, colorLink }}>
      <div className="App">
        <Header />
        <div>
          <div className="container">
            <div className="row">
              <div className="col-lg-4">
                <div className="row">
                  <div className="col-lg-12">
                    <LessonInfo
                      onCreateLesson={(formValues, colorForms, lessonLink) => onCreateLesson(formValues, colorForms, lessonLink)}
                      arrNullValues={arrNullValues}
                    />
                  </div>
                  <div className="col-lg-12 optMargin">
                    <OptionalRecs onCheckOptRecs={checkboxValues => onCheckOptRecs(checkboxValues)}
                                  optRecs={optRecs} />
                  </div>
                </div>
              </div>
              <div className="col-lg-3 logAnalyzer">
                <div className="row">
                  <div className="lessonInfo">
                    Логи урока
                  </div>
                  <div className="col-lg-12 col-md-6 col-sm-6">
                    <LogAnalyzer
                      durationLesson={lesson.durationLesson}
                      logs={logsPupil}
                      role={"У"}
                    />
                  </div>
                  {isLargeScreen && <div className="col-lg-12">
                    <Journal
                      durationLesson={lesson.durationLesson}
                      journal={lesson.journal}
                      lessonType={lesson.type}
                    />
                  </div>}
                  <div className="col-lg-12 col-md-6 col-sm-6">
                    <LogAnalyzer
                      durationLesson={lesson.durationLesson}
                      logs={logsTutor}
                      role={emailTutor.includes("tetrika.school") ? "МВУ" : "П"}
                    />
                  </div>
                </div>
                {isSmallScreen && <div>
                  <Journal
                    durationLesson={lesson.durationLesson}
                    journal={lesson.journal}
                    lessonType={lesson.type}
                  />
                </div>}
              </div>
              <div className="col-lg-5 resumeFields">
                <div className="row">
                  <div className="lessonInfo">
                    Резюмирование и компенсация
                  </div>
                  <div className="col-lg-12 resumePupil">
                    <ResumeField
                      userRole={"У"}
                      message={messageToPupil}
                      renewMessage={(message, messageText) => renewMessagePupil(message, messageText)}
                      renew={renew}
                      emailUser={emailPupil}
                      chatLink={lesson.pupilChat}
                    />
                  </div>
                  <div className="tutorCashComponent">
                    <TutorCash
                      tutorCash={tutorCash}
                      messageCompens={messageCompens}
                      link={link} />
                  </div>
                  <div className="col-lg-12 resumeTutor">
                    <ResumeField
                      userRole={emailTutor.includes("tetrika.school") ? "МВУ" : "П"}
                      message={messageToTutor}
                      renewMessage={(message, messageText) => renewMessageTutor(message, messageText)}
                      renew={renew}
                      emailUser={emailTutor}
                      chatLink={lesson.tutorChat}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="button-div mainButtons">
          <button type="button"
                  name="createButton"
                  className="btn btn-secondary bg-gradient btn-lg w-200 mx-auto mx-lg-0 mt-10"
                  onClick={generateSummary}>Создать
          </button>
          <button type="button"
                  name="clearButton"
                  className="btn btn-secondary bg-gradient btn-lg mx-auto mx-lg-0 mt-10 ml-10"
                  onClick={setCheckReset}>Очистить
          </button>
          <button type="button"
                  name="testButton"
                  style={{ display: "none" }}
                  className="btn btn-primary btn-lg mx-auto mx-lg-0 mt-10 ml-10"
                  onClick={createNames}>Тест
          </button>
        </div>
        <div>
          <div className="versionText">
            Создал&nbsp;<a href="https://mm.tetrika.school/tetrika/messages/@vadim.bykadorov"
                           target="_blank">VaultBoy</a>&nbsp;для ТП Тетрики, (v1.9.7,
            01.07.2023). &nbsp;{!isMobileScreen && <a
            href="https://drive.google.com/u/0/uc?id=1e9vcYKp7z0hIHqnt_tS8_UpUN5VM6VmX&export=download"
            target="_blank">SuG Extension v1.8</a>}
          </div>
        </div>
      </div>
    </AppContext.Provider>
  );
}

export default App;

