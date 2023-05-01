import "./App.css";
import Header from "./components/Header";
import LessonInfo from "./components/LessonInfo";
import OptionalRecs from "./components/OptionalRecs";
import ResumeField from "./components/ResumeField";
import React from "react";
import { messages } from "./components/messages";
import { statusInfo } from "./components/statusInfo";

function App() {

  const [messageToPupil, setMessageToPupil] = React.useState("");
  const [messageToTutor, setMessageToTutor] = React.useState("");
  const [optRecs, setOptRecs] = React.useState({});
  const [lesson, setLesson] = React.useState({});
  const [color, setColor] = React.useState({});

  const handleCreateLesson = (formValues) => {
    setLesson(formValues);
    console.log(lesson);
  };

  const handleCreateColor = (colorForms) => {
    setColor(colorForms);
  };

  const handleOptionalRecs = (checkboxValues) => {
    setOptRecs(checkboxValues);
  };

  const highlightInput = () => {
    console.log(arrNullValues);
    for (let name of arrNullValues) {
      setColor(prevState => ({ ...prevState, [name]: "yellow" }));
      console.log(setColor);
      setTimeout(
        () => (setColor(prevState => ({ ...prevState, [name]: "white" }))),
        800
      );
    }
    console.log(lesson);
  };

  let arrayFNF = [];
  let statusLessonMessage = ["", ""];

  const setStatusLesson = () => {
    const arrayDayOfWeek = ["понедельник", "вторник", "среда", "четверг", "пятница", "суббота", "воскресенье"];
    const dateLessonArray = lesson.dateLesson.split(" ").filter((n) => {
      return !arrayDayOfWeek.includes(n.replace(",", ""));
    });
    const dateAndTime = `${dateLessonArray[1]} ${dateLessonArray[2]} в ${dateLessonArray[0]}`;
    if (lesson.nameTutor !== undefined) {
      arrayFNF = lesson.nameTutor.split(" ");
    }

    const setStatusLessonMessage = (pupilMessage, tutorMessage) => {
      const startInfoPupil = `\n\nУрок, назначенный на ${dateAndTime} по Мск (преподаватель ${arrayFNF[0]} ${arrayFNF[1]}), `;
      const startInfoTutor = `\n\nУрок, назначенный на ${dateAndTime} по Мск с учеником ${lesson.namePupil} ${lesson.idPupil}, `;
      return statusLessonMessage = [`${startInfoPupil}${pupilMessage}`,
        `${startInfoTutor}${tutorMessage}`];
    };

    switch (Number(lesson.statusLesson)) {
      //Неявка У - РУ
      case 1:
        setStatusLessonMessage(statusInfo.nonPupilRegP, statusInfo.nonPupilT);
        break;
      // Неявка У - ВУ
      case 2:
        setStatusLessonMessage(statusInfo.nonPupilIntroP, statusInfo.nonPupilT);
        break;
      //Неявка П - РУ
      case 3:
        setStatusLessonMessage(statusInfo.nonTutorRegP, statusInfo.nonTutorRegT);
        break;
      //Неявка П - ВУ
      case 4:
        setStatusLessonMessage(statusInfo.nonTutorIntroP, statusInfo.nonTutorIntroT);
        break;
      //Отмена РУ - ВНН
      case 5:
        setStatusLessonMessage(statusInfo.cancelNotCauseP, statusInfo.cancelNotCauseT);
        break;
      //Отмена РУ - ТПсДС
      case 6:
        setStatusLessonMessage(statusInfo.cancelBothP, statusInfo.cancelBothT);
        break;
      //Отмена РУ + компенс
      case 7:
        setStatusLessonMessage(statusInfo.cancelBugP, statusInfo.cancelBugT);
        break;
      // Завершено
      case 8:
        setStatusLessonMessage(statusInfo.finish, statusInfo.finish);
        break;
    }
  };

  const optRecsChecker = (checkCookie, checkInt, checkBrowser, checkHardware, checkOnpComp) => {
    const checker = (checkName, rec) => {
      return checkName === true ? rec : "";
    };
    const message = `${checker(checkCookie, messages.cookieRec)}${
      checker(checkInt, messages.internetRec)}${checker(checkBrowser, messages.browserRec)}${
      checker(checkHardware, messages.hardwareRec)}${
      checker(checkOnpComp, messages.onpTutorMessage)
    }`;
    return message;
  };

  let arrNullValues = [];

  const generateSummary = () => {

    for (let name in lesson) {
      if (lesson[name] === "") {
        if (arrNullValues.includes(name)) {
          continue;
        } else {
          arrNullValues.push(name);
        }
      }
    }

    if (arrNullValues.length > 0) {
      highlightInput();
      return;
    } else {
      setStatusLesson();

      setMessageToPupil(`Здравствуйте, ${lesson.namePupil}. Техподдержка Тетрики снова на связи!${optRecsChecker(optRecs.checkCookiePupil,
        optRecs.checkLowSpeedPupil, optRecs.checkBrowserPupil, optRecs.checkHardwarePupil
      )}${statusLessonMessage[0]}${optRecs.checkCompPupil === false ? "" : messages.compPupilMessage}\n\n${optRecs.checkTrueCallPupil === false ? messages.summarizingMessage : messages.noCallMessage}`);
      setMessageToTutor(`Здравствуйте, ${arrayFNF[0]}. Техподдержка Тетрики снова на связи!${optRecsChecker(optRecs.checkCookieTutor,
        optRecs.checkLowSpeedTutor, optRecs.checkBrowserTutor, optRecs.checkHardwareTutor, optRecs.checkOnpTutor
      )}${statusLessonMessage[1]}\n\n${optRecs.checkTrueCallTutor === false ? messages.summarizingMessage : messages.noCallMessage}`);
    }
  };


  const createNames = () => {
    lesson.dateLesson = `18:00 четверг, 31 февраля`;
    lesson.nameTutor = `Тест Тестович Тетрилин`;
    lesson.idPupil = `Ливерная Голубка 14`;
    lesson.namePupil = `Тест Ева`;
    console.log(lesson);
  };

  return (
    <div className="App">
      <Header />
      <div>
        <div className="container">
          <div className="row">
            <div className="col-lg-4">
              <div className="row">
                <div className="col-lg-12">
                  <LessonInfo onCreateLesson={formValues => handleCreateLesson(formValues)}
                              onCreateColor={colorForms => handleCreateColor(colorForms)}
                              arrNullValues={arrNullValues}
                              color={color}
                  />
                </div>
                <div className="col-lg-12">
                  <OptionalRecs onCheckOptRecs={checkboxValues => handleOptionalRecs(checkboxValues)} />
                </div>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="row">
                <div className="col-lg-12">
                  <ResumeField
                    userRole={"ученика"}
                    message={messageToPupil}
                  />
                </div>
                <div className="col-lg-12">
                  <ResumeField
                    userRole={"преподавателя"}
                    message={messageToTutor}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <button type="button" className="btn btn-primary btn-lg w-200 mx-auto mx-lg-0 mt-10"
                onClick={generateSummary}>Создать
        </button>

        <button type="button"
                className="btn btn-primary btn-lg w-200 mx-auto mx-lg-0 mt-10 ml-10"
                onClick={createNames}>Заполнить
        </button>
      </div>
      <div className="d-flex justify-end" style={{ color: "white", fontSize: "14px" }}>
        Создал VaultBoy для ТП Тетрики, (v0.3, 30.04.2023).
      </div>
    </div>
  );
}

export default App;
