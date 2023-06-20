const statusLessonArr = [
  "Выбрать статус урока",
  "Неявка У (РУ)",
  "Неявка У (ВУ)",
  "Неявка П (РУ)",
  "Неявка П (ВУ)",
  "Отмена (ВНН)",
  "Отмена (ТПсДС)",
  "Отмена + компенс",
  "Завершено"
];

class LessonInfo {

  get lessonInfoComponent() {
    return cy.get("div.lessonInfoComponent").as("lessonInfo");
  }

  lessonInfoInput(name) {
    return this.lessonInfoComponent.find(`input[name=${name}]`);
  }

  get lessonLinkInput() {
    return this.lessonInfoInput("lessonLink");
  }

  get dateLessonInput() {
    return this.lessonInfoInput("dateLesson");
  }

  get nameTutorInput() {
    return this.lessonInfoInput("nameTutor");
  }

  get namePupilInput() {
    return this.lessonInfoInput("namePupil");
  }

  get idPupilInput() {
    return this.lessonInfoInput("idPupil");
  }

  get statusLessonSelector() {
    return this.lessonInfoComponent.find("select[name='statusLesson']");
  }

  allInputs() {
    const lessonInputs = [
      this.dateLessonInput,
      this.nameTutorInput,
      this.namePupilInput,
      this.idPupilInput,
      this.lessonLinkInput
    ];

    return lessonInputs
  }

  typeValue(selector, value) {
    selector.type(value);
    return this;
  }

  checkInputText(selector, text) {
    selector
      .should("exist")
      .invoke("val")
      .should("eq", text);
    return this;
  }

  typeLessonLink(link) {
    return this.typeValue(this.lessonLinkInput, link);
  }

  typeDateLesson(date) {
    return this.typeValue(this.dateLessonInput, date);
  }

  typeFullNameTutor(name) {
    return this.typeValue(this.nameTutorInput, name);
  }

  typeNamePupil(name) {
    return this.typeValue(this.namePupilInput, name);
  }

  typeIdPupil(id) {
    return this.typeValue(this.idPupilInput, id);
  }

  checkLessonLink(link) {
    return this.checkInputText(this.lessonLinkInput, link);
  }

  checkDateLesson(date) {
    return this.checkInputText(this.dateLessonInput, date);
  }

  checkFullNameTutor(name) {
    return this.checkInputText(this.nameTutorInput, name);
  }

  checkNamePupil(name) {
    return this.checkInputText(this.namePupilInput, name);
  }

  checkIdPupil(id) {
    return this.checkInputText(this.idPupilInput, id);
  }

  selectAndCheckStatus(id) {
    this.statusLessonSelector.select(id);
    this.statusLessonSelector.should("contain.text", statusLessonArr[id]);
    return this;
  }

  checkStatus() {
    this.statusLessonSelector
      .should("be.visible")
      .should("contain.text", "Выбрать статус урока");
  }

}

export default new LessonInfo();