import "./App.css";
import Header from "./components/Header";
import LessonInfo from "./components/LessonInfo";
import OptionalRecs from "./components/OptionalRecs";
import ResumeField from "./components/ResumeField";
import React from "react";

function App() {

  const [messageToPupil, setMessageToPupil] = React.useState("");
  const [messageToTutor, setMessageToTutor] = React.useState("");
  const [statusLessonMessage, setStatusLessonMessage] = React.useState([]);
  const [summarizing, setSummarizing] = React.useState(
    `Если у вас остались вопросы, напишите, пожалуйста, в чат поддержки личного кабинета. Также, вы можете нажать на кнопку в уроке "Сообщить о тех. проблеме", я или мой коллега оперативно придем к вам на помощь. Кнопка расположена в разделе "Чат с поддержкой", рядом с кнопкой "Чат с репетитором".`
  );
  const [lesson, setLesson] = React.useState(null);
  const handleCreateLesson = (formValues) => {
    const lesson = {
      dateLesson: formValues.dateLessonInput,
      nameTutor: formValues.nameTutorInput,
      namePupil: formValues.namePupilInput,
      idPupil: formValues.idPupilInput,
      statusLesson: formValues.statusLessonToggle
    };
    setLesson(lesson);
    console.log(lesson);
  };
  let arrayFNF = [];
  if (lesson !== null) {
    arrayFNF = lesson.nameTutor.split(" ");
  }

  const setStatusLesson = () => {
    const arrayDayOfWeek = ["понедельник", "вторник", "среда", "четверг", "пятница", "суббота", "воскресенье"];
    const dateLessonArray = lesson.dateLesson.split(" ").filter((n) => {
      return !arrayDayOfWeek.includes(n.replace(",", ""));
    });
    const dateAndTime = `${dateLessonArray[1]} ${dateLessonArray[2]} в ${dateLessonArray[0]}`;

    console.log(dateAndTime);


    switch (Number(lesson.statusLesson)) {
      //Неявка У - РУ
      case 1:
        setStatusLessonMessage([`Урок, назначенный на ${dateAndTime} по Мск (преподаватель ${arrayFNF[0]} ${arrayFNF[1]}), отменен в связи с техническими неполадками с вашей стороны. По правилам школы, он будет списан у вас с баланса.`,
          `Урок, назначенный на ${dateAndTime} по Мск с учеником ${lesson.namePupil} ${lesson.idPupil}, отменен в связи с техническими неполадками со стороны ученика. За урок вам начислена компенсация.
Ученику предоставлены все необходимые рекомендации, чтобы избежать неполадок с его стороны на будущих уроках.`]);
        break;
      //Неявка У - ВУ
      case 2:
        setStatusLessonMessage([`Урок, назначенный на ${dateAndTime} по Мск (преподаватель ${arrayFNF[0]} ${arrayFNF[1]}), отменен в связи с техническими неполадками с вашей стороны. Урок возвращен вам на баланс. С вами свяжется мой коллега по поводу его переназначения.`,
          `Урок, назначенный на ${dateAndTime} по Мск с учеником ${lesson.namePupil} ${lesson.idPupil}, отменен в связи с техническими неполадками со стороны ученика. За урок вам начислена компенсация.
Ученику предоставлены все необходимые рекомендации, чтобы избежать неполадок с его стороны на будущих уроках.`]);
        break;
      //Неявка П - РУ
      case 3:
        setStatusLessonMessage([`Урок, назначенный на ${dateAndTime} по Мск (преподаватель ${arrayFNF[0]} ${arrayFNF[1]}), отменен в связи с техническими неполадками со стороны преподавателя. Урок возвращен вам на баланс. В качестве извинения, я начислил вам бонусный урок.
Преподавателю предоставлены все необходимые рекомендации, чтобы избежать неполадок с его стороны на будущих уроках.`,
          `Урок, назначенный на ${dateAndTime} по Мск с учеником ${lesson.namePupil} ${lesson.idPupil}, отменен в связи с техническими неполадками с вашей стороны. По правилам школы, за урок полагается штраф в размере ставки урока.`]);
        break;
      //Неявка П - ВУ
      case 4:
        setStatusLessonMessage([`Урок, назначенный на ${dateAndTime} по Мск (преподаватель ${arrayFNF[0]} ${arrayFNF[1]}), отменен в связи с техническими неполадками со стороны преподавателя. Урок возвращен вам на баланс. С вами свяжется мой коллега по поводу его переназначения.
Преподавателю предоставлены все необходимые рекомендации, чтобы избежать неполадок с его стороны на будущих уроках.`,
          `Урок, назначенный на ${dateAndTime} по Мск с учеником ${lesson.namePupil} ${lesson.idPupil}, отменен в связи с техническими неполадками с вашей стороны. Штраф за данный урок не полагается.`]);
        break;
      //Отмена РУ - ВНН
      case 5:
        setStatusLessonMessage([`Урок, назначенный на ${dateAndTime} по Мск (преподаватель ${arrayFNF[0]} ${arrayFNF[1]}), отменен, поскольку не удалось установить причину неполадки. По правилам школы, урок возвращен вам на баланс.`,
          `Урок, назначенный на ${dateAndTime} по Мск с учеником ${lesson.namePupil} ${lesson.idPupil}, отменен, поскольку не удалось установить причину неполадки. По правилам школы, оплата за урок не полагается.`]);
        break;
      //Отмена РУ - ТПсДС
      case 6:
        setStatusLessonMessage([`Урок, назначенный на ${dateAndTime} по Мск (преподаватель ${arrayFNF[0]} ${arrayFNF[1]}), отменен в связи с техническими неполадками как с вашей стороны, так и со стороны преподавателя. По правилам школы, урок вернется вам на баланс.
Преподавателю предоставлены все необходимые рекомендации, чтобы избежать неполадок с его стороны на будущих уроках.`,
          `Урок, назначенный на ${dateAndTime} по Мск с учеником ${lesson.namePupil} ${lesson.idPupil}, отменен в связи с техническими неполадками как с вашей стороны, так и со стороны ученика. По правилам школы, оплата за урок не полагается. 
Ученику предоставлены все необходимые рекомендации, чтобы избежать неполадок с его стороны на будущих уроках.`]);
        break;
      default:
        setStatusLessonMessage([``, ``]);
    }
  };

  const generateSummary = () => {
    setStatusLesson();
    setMessageToPupil(`Здравствуйте, ${lesson.namePupil}. Техподдержка Тетрики снова на связи!\n\n${statusLessonMessage[0]}\n\n${summarizing}`);
    setMessageToTutor(`Здравствуйте, ${arrayFNF[0]}. Техподдержка Тетрики снова на связи!\n\n${statusLessonMessage[1]}\n\n${summarizing}`);
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
                  <LessonInfo onCreateLesson={formValues => handleCreateLesson(formValues)} />
                </div>
                <div className="col-lg-12">
                  <OptionalRecs />
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
      </div>
      <div className="d-flex justify-end" style={{ color: "white" }}>
        Создал VaultBoy специально для ТП Тетрики, апрель 2023г.
      </div>
    </div>
  );
}

export default App;
