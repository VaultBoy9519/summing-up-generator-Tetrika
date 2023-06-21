import lessonInfo from "../pom/LessonInfo";
import "../support/commands";
import resumeFieldPupil from "../pom/ResumeFieldPupil";
import mainButtons from "../pom/MainButtons";
import resumeFieldTutor from "../pom/ResumeFieldTutor";
import optionalRecs from "../pom/OptionalRecs";
import { messagesText } from "../messages";

const { fakerRU } = require("@faker-js/faker");


//v0.2 от 21.06.2023.

function getRandomNumber(min, max) {
  return Math.round(Math.random() * (max - min)) + min;
}

function getRandomClock(min, max) {
  const randomNumber = Math.round(Math.random() * (max - min)) + min;
  if (randomNumber < 10) {
    return randomNumber.toString().padStart(2, "0");
  } else {
    return randomNumber;
  }
}

const tutor = {
  firstName: fakerRU.person.firstName("male"),
  middleName: fakerRU.person.middleName("male"),
  lastName: fakerRU.person.lastName("male")
};

const month = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
const dateLesson = {
  clock: `${getRandomClock(0, 23)}:${getRandomClock(0, 59)}`,
  date: `${getRandomClock(1, 31)}`,
  weekday: `${fakerRU.date.weekday().toLowerCase()}`,
  month: `${month[getRandomNumber(0, 11)]}`
};

const lesson = {
  link: "https://tetrika-school.ru/adminka/lessons/0e20d91c-8329-4fd9-8962-44420e3a4935",
  id: "0e20d91c-8329-4fd9-8962-44420e3a4935",
  date: `${dateLesson.clock} ${dateLesson.weekday}, ${dateLesson.date} ${dateLesson.month}`,
  finalDate: `${parseInt(dateLesson.date, 10)} ${dateLesson.month} в ${dateLesson.clock}`,
  tutorFullName: `${tutor.firstName} ${tutor.middleName} ${tutor.lastName}`,
  tutorName: `${tutor.firstName}`,
  tutorNameAndMiddle: `${tutor.firstName} ${tutor.middleName}`,
  pupilName: fakerRU.person.firstName(),
  pupilId: `${fakerRU.color.human()} ${fakerRU.lorem.word()} ${getRandomClock(1, 99)}`
};

describe.only("Тестирование генератора в ручном режиме", () => {

  const messages = messagesText(lesson);

  beforeEach(() => {
    // cy.postAuth();
    cy.visit("http://localhost:3000/summing-up-generator-Tetrika");
    cy.get("p.titleGen").should("contain.text", "Генератор резюмирования");
  });

  const checkFields = (pupilMessage, tutorMessage, textNotEmpty) => {
    mainButtons
      .clickCreateButton();
    resumeFieldPupil
      .checkResumeTextarea(pupilMessage)
      .clickCopyText(textNotEmpty);

    resumeFieldTutor
      .checkResumeTextarea(tutorMessage)
      .clickCopyText(textNotEmpty);
  };

  it("Резюмирования не создаются, если хотя бы одно поле пустое", () => {

    const lessonInputs = lessonInfo.allInputs();

    checkFields("", "", false);

    for (let i = 0; i < lessonInputs.length - 1; i++) {
      if (i !== 0) {
        lessonInputs[i - 1].clear();
        lessonInputs[i].type(`Тестовое значение`);
      } else {
        lessonInputs[i].type(`Тестовое значение`);
      }
      checkFields("", "", false);
    }

    for (let id = 1; id < 9; id++) {
      lessonInfo
        .selectAndCheckStatus(id);
      checkFields("", "", false);
    }

    optionalRecs
      .checkAllCheckbox("be.checked");
    checkFields("", "", false);

  });

  const firstInputsLesson = () => {
    lessonInfo
      .typeDateLesson(lesson.date)
      .checkDateLesson(lesson.date)
      .typeFullNameTutor(lesson.tutorFullName)
      .checkFullNameTutor(lesson.tutorFullName)
      .typeNamePupil(lesson.pupilName)
      .checkNamePupil(lesson.pupilName)
      .typeIdPupil(lesson.pupilId)
      .checkIdPupil(lesson.pupilId);
  };

  const checkClearForms = () => {
    const lessonInputs = lessonInfo.allInputs();
    lessonInputs.forEach((input) => {
      input.should("have.text", "");
    });
    lessonInfo.checkStatus();

    optionalRecs
      .checkAllCheckbox("not.be.checked");
  };

  it("Проверка создания, изменения резюмирования, статуса 'Неявка У на РУ'", () => {
    firstInputsLesson();
    lessonInfo.checkStatus();
    checkFields(
      messages.notStatus.pupil.standart,
      messages.notStatus.tutor.standart,
      true
    );

    lessonInfo
      .selectAndCheckStatus(1);

    const createFirstIteration = (status) => {
      optionalRecs
        .checkCompPupil(status)
        .checkLowSpeedPupil(status)
        .checkHardwarePupil(status)
        .checkBrowserTutor(status)
        .checkServiceTutor(status)
        .checkLowSpeedTutor(status);
    };

    createFirstIteration("be.checked");

    checkFields(
      messages.notPupilRegular.pupil.speedHardwComp,
      messages.notPupilRegular.tutor.speedBrowserService,
      true
    );

    createFirstIteration("not.be.checked");

    const createSecondIteration = (status) => {
      optionalRecs
        .checkTrueCallPupil(status)
        .checkCookiePupil(status)
        .checkMobileOfTutor(status)
        .checkOnpTutor(status)
        .checkCookieTutor(status);
    };

    createSecondIteration("be.checked");
    optionalRecs
      .checkBrowserMobilePupil("be.checked");


    checkFields(
      messages.notPupilRegular.pupil.cookieMobBrNotCall,
      messages.notPupilRegular.tutor.cookieMobBrOnp,
      true
    );

    createSecondIteration("not.be.checked");

    optionalRecs
      .checkServicePupil("be.checked")
      .checkBrowserPupil("be.checked")
      .checkTrueCallTutor("be.checked")
      .checkHardwareTutor("be.checked");

    checkFields(
      messages.notPupilRegular.pupil.browserService,
      messages.notPupilRegular.tutor.hardwNotCall,
      true
    );

  });

  it("Проверка всех рекомендаций, очистки форм и статуса 'Неявка У на ВУ'", () => {
    firstInputsLesson();
    lessonInfo.checkStatus();
    lessonInfo.selectAndCheckStatus(2);
    checkFields(
      messages.notPupilIntro.pupil.standart,
      messages.notPupilIntro.tutor.standart,
      true
    );
    optionalRecs
      .checkAllCheckbox("be.checked");
    checkFields(
      messages.notPupilIntro.pupil.allRecs,
      messages.notPupilIntro.tutor.allRecs,
      true
    );

    mainButtons.clickClearButton();

    checkClearForms();

  });

  const checkCreateStatus = (id, pupilMessage, tutorMessage) => {
    firstInputsLesson();
    lessonInfo.checkStatus();
    lessonInfo.selectAndCheckStatus(id);
    checkFields(
      pupilMessage,
      tutorMessage,
      true
    );
  };

  it("Проверка статуса 'Неявка П на РУ'", () => {
    checkCreateStatus(3, messages.notTutorRegular.pupil, messages.notTutorRegular.tutor);
  });

  it("Проверка статуса 'Неявка П на ВУ'", () => {
    checkCreateStatus(4, messages.notTutorIntro.pupil, messages.notTutorIntro.tutor);
  });

  it("Проверка статуса 'Отмена (ВНН)'", () => {
    checkCreateStatus(5, messages.cancelVNN.pupil, messages.cancelVNN.tutor);
  });

  it("Проверка статуса 'Отмена (ТПсДС)'", () => {
    checkCreateStatus(6, messages.cancelBoth.pupil, messages.cancelBoth.tutor);
  });

  it("Проверка статуса 'Отмена + компенс'", () => {
    checkCreateStatus(7, messages.cancelComp.pupil, messages.cancelComp.tutor);
  });

  it("Проверка статуса 'Закончено'", () => {
    checkCreateStatus(8, messages.finish.pupil, messages.finish.tutor);
  });

});

describe(`Тестирование генератора в автоматическом режиме`, () => {

  beforeEach(() => {
    cy.postAuth();
    cy.visit("https://tetrika-school.ru/adminka");
    cy.wait(3000);
    cy.visit("http://localhost:3000/summing-up-generator-Tetrika");


    cy.get("p.titleGen").should("contain.text", "Генератор резюмирования");
  });

  it("Тестовый запуск", () => {
    lessonInfo
      .typeLessonLink("1");


    cy.wait(20000);
  });

});