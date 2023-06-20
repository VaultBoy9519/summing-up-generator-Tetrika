import lessonInfo from "../pom/LessonInfo";
import "../support/commands";
import resumeFieldPupil from "../pom/ResumeFieldPupil";
import mainButtons from "../pom/MainButtons";
import resumeFieldTutor from "../pom/ResumeFieldTutor";
import optionalRecs from "../pom/OptionalRecs";
import { messagesText } from "../messages";

//v0.1 от 20.06.2023. Работает только ручной режим ввода

describe("Тестирование генератора в ручном режиме", () => {

  const lesson = {
    link: "https://tetrika-school.ru/adminka/lessons/0e20d91c-8329-4fd9-8962-44420e3a4935",
    id: "0e20d91c-8329-4fd9-8962-44420e3a4935",
    date: "11:00 понедельник, 08 мая",
    finalDate: "8 мая в 11:00",
    tutorFullName: "Оксана Алексеевна Иванова",
    tutorName: "Оксана",
    tutorNameAndMiddle: "Оксана Алексеевна",
    pupilName: "Екатерина",
    pupilId: "Серая савка 60",
    status: "Выбрать статус урока"
  };

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