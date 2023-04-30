import "./App.css";
import Header from "./components/Header";
import LessonInfo from "./components/LessonInfo";
import OptionalRecs from "./components/OptionalRecs";
import ResumeField from "./components/ResumeField";
import React from "react";

function App() {

  const internetRec = `\n\nУ вас зафиксирована низкая скорость интернет-соединения. Рекомендую во время урока находиться ближе к роутеру или, при возможности, использовать проводное подключение. Также, перед следующим занятием, перезагрузите, пожалуйста, роутер. Если неполадка все равно повторится и рекомендации выше не помогут, обратитесь, пожалуйста, к вашему интернет-провайдеру.

Скорость интернет-соединения вы можете проверить на сайте www.speedtest.net. Подробная инструкция по измерению скорости доступна по ссылке: 
https://tetrikasupp.notion.site/9ca6313f16384947ad499d64bf064580`;
  const browserRec = `\n\nИспользуемый вами браузер не подходит для занятий. Пользуйтесь, пожалуйста, Google Chrome или Mozilla Firefox. Скачать их вы можете по этим ссылкам:

Google Chrome: https://www.google.com/intl/ru/chrome/
Mozilla Firefox: https://www.mozilla.org/ru/firefox/new/

Для устройств от компании Apple вы можете использовать стандартный браузер Safari.

Более подробно с установкой браузера вы можете ознакомиться в этих статьях:
https://tetrikasupp.notion.site/Windows-bcc2b1b95f4849d59bf8a9024e011f37
https://tetrikasupp.notion.site/Mac-ff3f6f8346e541669122d88def2042b4`;
  const hardwareRec = `\n\nУстройство, которое вы используете, не подходит для занятий по системным требованиям, указанным в договоре-оферте. Для комфортных уроков рекомендую сменить его на более современное.

Для выбора устройства ознакомьтесь, пожалуйста, с системными требованиями по ссылке ниже:
https://tetrikasupp.notion.site/54f51d9eb9b64a8f93856f635bcc30b3.`;
  const cookieRec = `\n\nДля решения возникшей неполадки рекомендую провести очистку временных файлов браузера. Заранее сообщаю, что после этих действий вы выйдете из всех аккаунтов на сайтах, где авторизовались ранее, и вам нужно будет сделать это повторно. Чтобы провести очистку, воспользуйтесь инструкцией для своего браузера:

Google Chrome: https://support.google.com/accounts/answer/32050?hl=ru&co=GENIE.Platform%3DDesktop
Mozilla Firefox: https://support.mozilla.org/ru/kb/udalenie-kuki-i-dannyh-sajtov-v-firefox?redirectslug=udalenie-kukov-dlya-udaleniya-informacii-kotoruyu-&redirectlocale=ru
Safari: https://support.apple.com/ru-ru/guide/safari/sfri11471/mac`;
  const onpTutorMessage = `\n\nЧерез две недели с вами свяжется мой коллега, чтобы узнать, удалось ли исправить неполадки, а также записать на повторную проверку.`;
  const compensPupilMessage = `\n\nПо вашей просьбе, передал запрос на компенсацию урока. В течение трех дней ваш запрос будет рассмотрен. Если запрос будет согласован, вам будет начислен компенсационный урок, и ответ об этом поступит в чат вашего личного кабинета.`;
  const summarizingMessage = `Если у вас остались вопросы, напишите, пожалуйста, в чат поддержки личного кабинета. Также, вы можете нажать на кнопку в уроке "Сообщить о тех. проблеме", я или мой коллега оперативно придем к вам на помощь. Кнопка расположена в разделе "Чат с поддержкой", рядом с кнопкой "Чат с репетитором".`;
  const noCallMessage = `Мы закрываем это обращение, так как не получилось связаться с вами.
Если вы ждете нашей помощи, пожалуйста, напишите удобный способ и время для связи.`;

  const [messageToPupil, setMessageToPupil] = React.useState("");
  const [messageToTutor, setMessageToTutor] = React.useState("");
  let statusLessonMessage = ["", ""];
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

  const setStatusLesson = () => {
    const arrayDayOfWeek = ["понедельник", "вторник", "среда", "четверг", "пятница", "суббота", "воскресенье"];
    const dateLessonArray = lesson.dateLesson.split(" ").filter((n) => {
      return !arrayDayOfWeek.includes(n.replace(",", ""));
    });
    const dateAndTime = `${dateLessonArray[1]} ${dateLessonArray[2]} в ${dateLessonArray[0]}`;
    if (lesson.nameTutor !== undefined) {
      arrayFNF = lesson.nameTutor.split(" ");
    }

    switch (Number(lesson.statusLesson)) {
      //Неявка У - РУ
      case 1:
        statusLessonMessage = [`\n\nУрок, назначенный на ${dateAndTime} по Мск (преподаватель ${arrayFNF[0]} ${arrayFNF[1]}), отменен в связи с техническими неполадками с вашей стороны. По правилам школы, он будет списан у вас с баланса.`,
          `\n\nУрок, назначенный на ${dateAndTime} по Мск с учеником ${lesson.namePupil} ${lesson.idPupil}, отменен в связи с техническими неполадками со стороны ученика. За урок вам начислена компенсация.
Ученику предоставлены все необходимые рекомендации, чтобы избежать неполадок с его стороны на будущих уроках.`];
        break;
      // Неявка У - ВУ
      case 2:
        statusLessonMessage = [`\n\nУрок, назначенный на ${dateAndTime} по Мск (преподаватель ${arrayFNF[0]} ${arrayFNF[1]}), отменен в связи с техническими неполадками с вашей стороны. Урок возвращен вам на баланс. С вами свяжется мой коллега по поводу его переназначения.`,
          `\n\nУрок, назначенный на ${dateAndTime} по Мск с учеником ${lesson.namePupil} ${lesson.idPupil}, отменен в связи с техническими неполадками со стороны ученика. За урок вам начислена компенсация.
Ученику предоставлены все необходимые рекомендации, чтобы избежать неполадок с его стороны на будущих уроках.`];
        break;
      //Неявка П - РУ
      case 3:
        statusLessonMessage = [`\n\nУрок, назначенный на ${dateAndTime} по Мск (преподаватель ${arrayFNF[0]} ${arrayFNF[1]}), отменен в связи с техническими неполадками со стороны преподавателя. Урок возвращен вам на баланс. В качестве извинения, я начислил вам бонусный урок.
Преподавателю предоставлены все необходимые рекомендации, чтобы избежать неполадок с его стороны на будущих уроках.`,
          `\n\nУрок, назначенный на ${dateAndTime} по Мск с учеником ${lesson.namePupil} ${lesson.idPupil}, отменен в связи с техническими неполадками с вашей стороны. По правилам школы, за урок полагается штраф в размере ставки урока.`];
        break;
      //Неявка П - ВУ
      case 4:
        statusLessonMessage = [`\n\nУрок, назначенный на ${dateAndTime} по Мск (преподаватель ${arrayFNF[0]} ${arrayFNF[1]}), отменен в связи с техническими неполадками со стороны преподавателя. Урок возвращен вам на баланс. С вами свяжется мой коллега по поводу его переназначения.
Преподавателю предоставлены все необходимые рекомендации, чтобы избежать неполадок с его стороны на будущих уроках.`,
          `\n\nУрок, назначенный на ${dateAndTime} по Мск с учеником ${lesson.namePupil} ${lesson.idPupil}, отменен в связи с техническими неполадками с вашей стороны. Штраф за данный урок не полагается.`];
        break;
      //Отмена РУ - ВНН
      case 5:
        statusLessonMessage = [`\n\nУрок, назначенный на ${dateAndTime} по Мск (преподаватель ${arrayFNF[0]} ${arrayFNF[1]}), отменен, поскольку не удалось установить причину неполадки. По правилам школы, урок возвращен вам на баланс.`,
          `\n\nУрок, назначенный на ${dateAndTime} по Мск с учеником ${lesson.namePupil} ${lesson.idPupil}, отменен, поскольку не удалось установить причину неполадки. По правилам школы, оплата за урок не полагается.`];
        break;
      //Отмена РУ - ТПсДС
      case 6:
        statusLessonMessage = [`\n\nУрок, назначенный на ${dateAndTime} по Мск (преподаватель ${arrayFNF[0]} ${arrayFNF[1]}), отменен в связи с техническими неполадками как с вашей стороны, так и со стороны преподавателя. По правилам школы, урок вернется вам на баланс.
Преподавателю предоставлены все необходимые рекомендации, чтобы избежать неполадок с его стороны на будущих уроках.`,
          `\n\nУрок, назначенный на ${dateAndTime} по Мск с учеником ${lesson.namePupil} ${lesson.idPupil}, отменен в связи с техническими неполадками как с вашей стороны, так и со стороны ученика. По правилам школы, оплата за урок не полагается.
Ученику предоставлены все необходимые рекомендации, чтобы избежать неполадок с его стороны на будущих уроках.`];
        break;
      case 7:
        statusLessonMessage = [`\n\nУрок, назначенный на ${dateAndTime} по Мск (преподаватель ${arrayFNF[0]} ${arrayFNF[1]}), отменен в связи с техническими неполадками со стороны платформы. Урок возвращен вам на баланс. В качестве извинения, я начислил вам бонусный урок.`,
          `\n\nУрок, назначенный на ${dateAndTime} по Мск с учеником ${lesson.namePupil} ${lesson.idPupil}, отменен в связи с техническими неполадками со стороны платформы. За урок вам начислена компенсация.`];
        break;
      case 8:
        statusLessonMessage = [`\n\nУрок, назначенный на ${dateAndTime} по Мск (преподаватель ${arrayFNF[0]} ${arrayFNF[1]}), по правилам школы считается проведенным, поскольку проведено больше половины урока.`,
          `\n\nУрок, назначенный на ${dateAndTime} по Мск с учеником ${lesson.namePupil} ${lesson.idPupil}, по правилам школы считается проведенным, поскольку проведено больше половины урока.`];
        break;
    }
  };

  const optRecsChecker = (checkCookie, checkInt, checkBrowser, checkHardware, checkOnpComp) => {
    const checker = (checkName, rec) => {
      return checkName === true ? rec : "";
    };
    const message = `${checker(checkCookie, cookieRec)}${
      checker(checkInt, internetRec)}${checker(checkBrowser, browserRec)}${
      checker(checkHardware, hardwareRec)}${
      checker(checkOnpComp, onpTutorMessage)
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
      )}${statusLessonMessage[0]}${optRecs.checkCompPupil === false ? "" : compensPupilMessage}\n\n${optRecs.checkTrueCallPupil === false ? summarizingMessage : noCallMessage}`);
      setMessageToTutor(`Здравствуйте, ${arrayFNF[0]}. Техподдержка Тетрики снова на связи!${optRecsChecker(optRecs.checkCookieTutor,
        optRecs.checkLowSpeedTutor, optRecs.checkBrowserTutor, optRecs.checkHardwareTutor, optRecs.checkOnpTutor
      )}${statusLessonMessage[1]}\n\n${optRecs.checkTrueCallTutor === false ? summarizingMessage : noCallMessage}`);
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
