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
import MassMode from "./components/MassMode";


function App() {

  const [optRecs, setOptRecs] = React.useState({});
  const [lesson, setLesson] = React.useState({});
  const [color, setColor] = React.useState({});
  const [renew, setRenew] = React.useState(true);
  const [colorLink, setColorLink] = React.useState("white");

  const [messageToPupil, setMessageToPupil] = React.useState("");
  const [messageToTutor, setMessageToTutor] = React.useState("");
  const [link, setLink] = React.useState("");
  const [emailPupil, setEmailPupil] = React.useState("");
  const [emailTutor, setEmailTutor] = React.useState("");
  const [tutorCash, setTutorCash] = React.useState("");
  const [messageCompens, setMessageCompens] = React.useState("");
  const [logsPupil, setLogsPupil] = React.useState("");
  const [logsTutor, setLogsTutor] = React.useState("");
  const [checkMass, setCheckMass] = React.useState("");

  const emptyKeys = [
    "messageToPupil",
    "messageToTutor",
    "link",
    "emailPupil",
    "emailTutor",
    "tutorCash",
    "messageCompens",
    "logsPupil",
    "logsTutor"
  ];

  const statusKeys = [
    "compens",
    "bl",
    "pupilMessage",
    "tutorMessage",
    "cancelLesson"
  ];

  const createData = (arr, value) => {
    const obj = {};
    arr.forEach(item => {
      obj[item] = value;
    });
    return obj;
  };

  const [info, setInfo] = React.useState(createData(emptyKeys, ""));

  const [sendStatus, setSendStatus] = React.useState(createData(statusKeys, ""));

  const isLargeScreen = useMediaQuery("(min-width: 992px)");
  const isSmallScreen = useMediaQuery("(max-width: 991px)");
  const isMobileScreen = useMediaQuery("(max-width: 500px)");

  const setValue = (setter, param, value) => {
    setter((prev) => ({
      ...prev,
      [param]: value
    }));
  };

  //Колбэки для получения пропсов из LessonInfo
  const onCreateLesson = (formValues, colorForms, lessonLink) => {
    setLesson(formValues);
    setColor(colorForms);
    setLink(lessonLink);
  };

  //три функции ниже отвечают за ререндер при нажатии кнопки
  //"Создать", если кто-то хочет вернуть данные после изменений
  const checkRenew = (setter, message, messageText) => {
    setRenew(false);
    if (renew === false && message !== "") {
      setter(messageText);
    }
  };

  const renewMessagePupil = (message, messageText) => {
    checkRenew(setMessageToPupil, message, messageText);
  };

  const renewMessageTutor = (message, messageText) => {
    checkRenew(setMessageToTutor, message, messageText);
  };

  //Колбэк для получения пропса из OptionalRecs
  const onCheckOptRecs = (checkboxValues) => {
    setOptRecs(checkboxValues);
  };

  //Колбэк для получения пропса из MassMode
  const massModeParam = (checkboxState) => {
    setCheckMass(checkboxState);
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
    setTutorCash("");
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
      const beginDateTimePupil = formatDate(logsPupil.beginDate);
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

      const compens = lesson.durationLesson === "120" ? 250 : 125;

      if (lesson.statusLesson === "1") {
        if (logsPupil.timeCountInLesson !== 0 && logsTutor.timeCountInLesson > cashTime && beginDateTimePupil < endDateTimeTutor) {
          cash = lesson.tutorCash - compens;
          setCompensAndMessage(cash);
        }
      } else if (lesson.statusLesson === "7") {
        if (logsPupil.timeCountInLesson !== 0 && logsTutor.timeCountInLesson > cashTime && beginDateTimePupil < endDateTimeTutor) {
          cash = lesson.tutorCash;
          setCompensAndMessage(cash);
        } else {
          setCompensAndMessage(compens);
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

      for (let numberStatus = 0; numberStatus <= keysPupil.length; numberStatus++) {
        if (numberStatus === (Number(lesson.statusLesson) - 1)) {
          const statusPupilValue = statusInfoPupil[keysPupil[numberStatus]];

          const checkMVU = () => {
            if (emailTutor.includes("tetrika.school")) {
              return "";
            } else {
              return ". За урок вам начислена компенсация";
            }
          };

          const tutorOrMvu = checkMVU();
          const compensMessage = (cash === lesson.tutorCash || cash === lesson.tutorCash - 125) && cash !== "" ? ` в размере ставки урока` : ``;
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
  const generateSummary = async () => {

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

    return true;
  };

  React.useEffect(() => {
    setValue(setSendStatus, "pupilMessage", "");
  }, [messageToPupil]);

  React.useEffect(() => {
    setValue(setSendStatus, "tutorMessage", "");
  }, [messageToTutor]);

  React.useEffect(() => {

    const setNullValuesSetters = (param, setter, value) => {
      for (let key in param) {
        setValue(setter, key, value);
      }
    };
    setNullValuesSetters(sendStatus, setSendStatus, "");

    setNullValuesSetters(sendMessages, setSendMessages, "");


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

      const data = event.data.data;

      if (data === `404 Not Found`) {
        setLink("");
        highlightInputLink("yellow", 3000);
      } else if (data === `Access denied` || data === undefined) {
        setLink("");
        highlightInputLink("orange", 1000);
      } else {
        const json = await JSON.parse(data);
        setLesson(json);
        setEmailPupil(json.emailPupil);
        setEmailTutor(json.emailTutor);
        setLogsPupil(json.pupilLogs);
        setLogsTutor(json.tutorLogs);
      }
    });
    return () => {
      clearTimeout(timerId);
    };
  }, [link]);


  function PayloadMessage(chatId, message, fullId) {
    this.message_id = fullId === lesson.fullIdTutor ? sendMessages["tutorMessageId"] : sendMessages["pupilMessageId"];
    this.channel_id = chatId && chatId;
    this.message = message;
    this.file_ids = [];
    this.props = {
      userId: fullId,
      userName: lesson.adminName,
      isTechIssue: false
    };
  }

  const sendMessagesKeys = ["tutor", "pupil", "tutorMessageId", "pupilMessageId"];

  const [sendMessages, setSendMessages] = React.useState(createData(sendMessagesKeys, ""));

  const sendMessage = () => {
    return new Promise((resolve) => {
      let receivedResponse = false;

      window.addEventListener("message", async (event) => {
        if (event.source !== window) {
          return;
        }

        switch (event.data.type) {
          case "FROM_CONTENT_COMPENS":
            receivedResponse = true;
            const response = event.data.data;
            console.log(response);
            setValue(setSendStatus, "compens", response);
            break;

          case "FROM_CONTENT_POST-MESSAGE":
            receivedResponse = true;
            const data = event.data.data;
            console.log(data);

            const setData = (status, messageId) => {
              setValue(setSendStatus, status, data.status);
              setValue(setSendMessages, messageId, data.message_id);
            };

            if (data.user_id === lesson.fullIdTutor) {
              setData("tutorMessage", "tutorMessageId");
            } else if (data.user_id === lesson.fullIdPupil) {
              setData("pupilMessage", "pupilMessageId");
            }
            console.log(sendStatus);
            break;

          case "FROM_CONTENT_BL":
            receivedResponse = true;
            console.log(`Статус БУ: `, event.data.data);
            setValue(setSendStatus, "bl", event.data.data);
            break;
          case "FROM_CONTENT_CANCEL":
            receivedResponse = true;
            console.log(`Статус: `, event.data.data);
            setValue(setSendStatus, "cancelLesson", event.data.data);
            break;
          default:
            return;
        }
        resolve(event.data.data);
      });
    });
  };

  // Передача сообщения любым слушателям в окнах
  window.postMessage({ type: "LOAD_CONTENT_SCRIPT" }, "*");

  const payloadMessagePupil = new PayloadMessage(lesson.pupilChat, messageToPupil, lesson.fullIdPupil);
  const payloadMessageTutor = new PayloadMessage(lesson.tutorChat, messageToTutor, lesson.fullIdTutor);

  const setQuark = () => {
    switch (lesson.quarks) {
      case "profi_60":
      case "profi_120":
        return "22";
      case "profi_30":
        return "2790";
      case "expert_60":
        return "33";
      case "student_60":
        return "34";
      default:
        return "0";
    }
  };

  const blPayload = {
    pupil_id: lesson.fullIdPupil,
    real_price: 0,
    price_id: setQuark(),
    action: "pay"
  };

  const compensPayload = {
    cash: tutorCash,
    comment: messageCompens,
    lessonId: link.includes(`tetrika-school.ru`) ? link.replace("https://tetrika-school.ru/adminka/lessons/", "") : link,
    adminName: lesson.adminName,
    fullIdTutor: lesson.fullIdTutor
  };

  const postMessage = async (payload, type, status) => {

    if (sendStatus[status] === "" || sendStatus[status] >= 400) {
      setValue(setSendStatus, status, "");
      window.postMessage(
        {
          type: type,
          data: payload
        },
        "*"
      );
      await sendMessage();
      return true;
    } else {
      setValue(setSendStatus, status, "Уже отправлено");
    }

  };


  const postAndCheckMessage = async (payload, message, status) => {

    if (payload.props.userId) {
      const role = payload.props.userId === lesson.fullIdTutor ? "tutor" : "pupil";
      if (message !== "") {
        console.log(`Проверка статуса:`, sendStatus[status]);
        if (sendMessages[role] !== message || sendStatus[status] >= 400) {
          if (sendStatus[status] >= 400) {
            setValue(setSendMessages, `${role}MessageId`, "");
          }
          await postMessage(payload, "FROM_PAGE_POST-MESSAGE", status);
          setValue(setSendMessages, role, message);
        } else if (!(sendStatus[status] >= 400)) {
          setValue(setSendStatus, status, "Уже отправлено");
        }

      } else {
        console.log("Сообщение пустое");
      }
    }

    return true;

  };

  const postCompensTutor = async () => {
    if (tutorCash > 0) {
      await postMessage(compensPayload, "FROM_PAGE_COMPENS", "compens");
    }
    return true;
  };

  const multiPost = async () => {
    if (messageToPupil !== "" && messageToTutor !== "") {

      if (lesson.statusLesson === "7" || checkMass) {
        // setValue(setLesson, "statusLesson", "7");
        await cancelLesson();
        await postMessage(blPayload, "FROM_PAGE_BL", "bl");
      }

      await postCompensTutor();

      await postAndCheckMessage(payloadMessagePupil, messageToPupil, "pupilMessage");
      await postAndCheckMessage(payloadMessageTutor, messageToTutor, "tutorMessage");


    } else {
      console.log(`Сообщения пустые`);
    }
  };

  const logger = () => {
    // console.log(sendStatus);
    // console.log(sendMessages);
    // console.log(payloadMessagePupil);
    // console.log(payloadMessageTutor);
    console.log(lesson);
    console.log(messageToPupil);
    console.log(messageToTutor);
    console.log(tutorCash);
  };

  const cancelLesson = async () => {

    const payload = {
      lesson_id: compensPayload.lessonId,
      event_id: lesson.eventId,
      lesson_status: lesson.statusName
    };

    await postMessage(payload, "FROM_PAGE_CANCEL", "cancelLesson");
  };

  const setClasses = (standart, status) => {
    let success = true;

    for (let key in status) {
      if (tutorCash === "" && key === "compens") {
        continue;
      }
      if (lesson.statusLesson !== "7" && key === "bl") {
        continue;
      }
      if (status[key] >= 400 && status[key] !== "") {
        success = false;
      } else if (status[key] === "Уже отправлено") {
        success = "warning";
      } else if (status[key] === "") {
        success = "";
      }
    }

    return `${standart}  ${(() => {
      if (success === true) {
        return "btn-success";
      } else if (success === false) {
        return "btn-danger";
      } else if (success === "warning") {
        return "btn-warning";
      } else if (success === "") {
        return "btn-secondary";
      }

    })()}`;
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

    const settersArr = [
      setLink,
      setMessageCompens,
      setMessageToPupil,
      setMessageToTutor,
      setEmailPupil,
      setEmailTutor,
      setTutorCash,
      setLogsPupil,
      setLogsTutor
    ];

    const setNullValue = (setters, value) => {
      setters.forEach(setter => {
        setter(value);
      });
    };

    setNullValue(settersArr, "");

    const setNullValuesSetters = (param, setter, value) => {
      for (let key in param) {
        setValue(setter, key, value);
      }
    };
    setNullValuesSetters(sendStatus, setSendStatus, "");

    setNullValuesSetters(sendMessages, setSendMessages, "");
  };

  React.useEffect(() => {

    if (link !== "") {
      generateSummary();
    }

  }, [lesson, optRecs]);

  return (
    <AppContext.Provider value={{ color, optRecs, lesson, link, colorLink }}>
      <div className="App">
        <Header
          massMode={checkMass}
        />
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
                  <div className="col-lg-12">
                    <MassMode
                      massModeParam={check => massModeParam(check)}
                    />
                  </div>
                  <div className="col-lg-12">
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
                      postMessage={() => postAndCheckMessage(payloadMessagePupil, messageToPupil, "pupilMessage")}
                      postMessageStatus={sendStatus.pupilMessage}
                      message={messageToPupil}
                      blStatus={sendStatus.bl}
                      postBl={() => postMessage(blPayload, "FROM_PAGE_BL", "bl")}
                      lessonStatus={lesson.statusLesson}
                      renewMessage={(message, messageText) => renewMessagePupil(message, messageText)}
                      renew={renew}
                      emailUser={emailPupil}
                      chatId={lesson.pupilChat}
                    />
                  </div>
                  <div className="tutorCashComponent">
                    <TutorCash
                      tutorCash={tutorCash}
                      compensStatus={sendStatus.compens}
                      postCompensTutor={postCompensTutor} />
                  </div>
                  <div className="col-lg-12 resumeTutor">
                    <ResumeField
                      userRole={emailTutor.includes("tetrika.school") ? "МВУ" : "П"}
                      message={messageToTutor}
                      postMessage={() => postAndCheckMessage(payloadMessageTutor, messageToTutor, "tutorMessage")}
                      postMessageStatus={sendStatus.tutorMessage}
                      renewMessage={(message, messageText) => renewMessageTutor(message, messageText)}
                      renew={renew}
                      emailUser={emailTutor}
                      chatId={lesson.tutorChat}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="button-div">
          <button type="button"
                  name="cancelCompensButton"
                  className={setClasses("btn btn-lg mx-auto mx-lg-0 mt-10", sendStatus)}
                  onClick={multiPost}
          >{
            setClasses("", sendStatus).includes("btn-danger") ?
              "Ошибка" :
              setClasses("", sendStatus).includes("btn-success") ?
                "Успешно" :
                setClasses("", sendStatus).includes("btn-warning") ?
                  "Уже отправлено" :
                  "Отправить всем"
          }
          </button>
          <button type="button"
                  style={{ display: "inline-block" }}
                  className={"btn btn-lg mx-auto mx-lg-0 mt-10 ml-10 btn-primary"}
                  onClick={logger}
          >Тест
          </button>
          <button type="button"
                  name="clearButton"
                  className="btn btn-secondary bg-gradient btn-lg mx-auto mx-lg-0 mt-10 ml-10"
                  onClick={setCheckReset}>Очистить
          </button>
        </div>
        <div>
          <div className="versionText">
            Авторы:&nbsp;<a href="https://mm.tetrika.school/tetrika/messages/@vadim.bykadorov"
                            target="_blank">VaultBoy</a>&nbsp;и&nbsp;<a
            href="https://t.me/t_a_32"
            target="_blank">t___a_0032</a>&nbsp; (v2.0.1,
            14.07.2023). &nbsp;{!isMobileScreen && <a
            href="https://drive.google.com/u/0/uc?id=1e9vcYKp7z0hIHqnt_tS8_UpUN5VM6VmX&export=download"
            target="_blank">SuG Extension v2.0.1</a>}
          </div>
        </div>
      </div>
    </AppContext.Provider>
  );
}

export default App;




