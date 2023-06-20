class OptionalRecs {

  get optionalRecsComponent() {
    return cy.get("div.otherInfo").as("optionalRecs");
  }

  checkboxCreator(name) {
    return this.optionalRecsComponent.find(`[name=${name}]`);
  }

  get checkboxCookieTutor() {
    return this.checkboxCreator("checkCookieTutor");
  }

  get checkboxCookiePupil() {
    return this.checkboxCreator("checkCookiePupil");
  }

  get checkboxLowSpeedTutor() {
    return this.checkboxCreator("checkLowSpeedTutor");
  }

  get checkboxLowSpeedPupil() {
    return this.checkboxCreator("checkLowSpeedPupil");
  }

  get checkboxBrowserTutor() {
    return this.checkboxCreator("checkBrowserTutor");
  }

  get checkboxBrowserPupil() {
    return this.checkboxCreator("checkBrowserPupil");
  }

  get checkboxMobileOfTutor() {
    return this.checkboxCreator("checkMobileOfTutor");
  }

  get checkboxBrowserMobilePupil() {
    return this.checkboxCreator("checkBrowserMobilePupil");
  }

  get checkboxHardwareTutor() {
    return this.checkboxCreator("checkHardwareTutor");
  }

  get checkboxHardwarePupil() {
    return this.checkboxCreator("checkHardwarePupil");
  }

  get checkboxServiceTutor() {
    return this.checkboxCreator("serviceRecTutor");
  }

  get checkboxServicePupil() {
    return this.checkboxCreator("serviceRecPupil");
  }

  get checkboxOnpTutor() {
    return this.checkboxCreator("checkOnpTutor");
  }

  get checkboxCompPupil() {
    return this.checkboxCreator("checkCompPupil");
  }

  get checkboxTrueCallTutor() {
    return this.checkboxCreator("checkTrueCallTutor");
  }

  get checkboxTrueCallPupil() {
    return this.checkboxCreator("checkTrueCallPupil");
  }

  clickCheckbox(checkbox, status) {
    checkbox.click();
    checkbox
      .should("be.visible")
      .should(status);
    return this;
  }

  checkCookieTutor(status) {
    return this.clickCheckbox(this.checkboxCookieTutor, status);
  }

  checkCookiePupil(status) {
    return this.clickCheckbox(this.checkboxCookiePupil, status);
  }

  checkLowSpeedTutor(status) {
    return this.clickCheckbox(this.checkboxLowSpeedTutor, status);
  }

  checkLowSpeedPupil(status) {
    return this.clickCheckbox(this.checkboxLowSpeedPupil, status);
  }

  checkBrowserTutor(status) {
    return this.clickCheckbox(this.checkboxBrowserTutor, status);
  }

  checkBrowserPupil(status) {
    return this.clickCheckbox(this.checkboxBrowserPupil, status);
  }

  checkMobileOfTutor(status) {
    return this.clickCheckbox(this.checkboxMobileOfTutor, status);
  }

  checkBrowserMobilePupil(status) {
    return this.clickCheckbox(this.checkboxBrowserMobilePupil, status);
  }

  checkHardwareTutor(status) {
    return this.clickCheckbox(this.checkboxHardwareTutor, status);
  }

  checkHardwarePupil(status) {
    return this.clickCheckbox(this.checkboxHardwarePupil, status);
  }

  checkServiceTutor(status) {
    return this.clickCheckbox(this.checkboxServiceTutor, status);
  }

  checkServicePupil(status) {
    return this.clickCheckbox(this.checkboxServicePupil, status);
  }

  checkOnpTutor(status) {
    return this.clickCheckbox(this.checkboxOnpTutor, status);
  }

  checkCompPupil(status) {
    return this.clickCheckbox(this.checkboxCompPupil, status);
  }

  checkTrueCallTutor(status) {
    return this.clickCheckbox(this.checkboxTrueCallTutor, status);
  }

  checkTrueCallPupil(status) {
    return this.clickCheckbox(this.checkboxTrueCallPupil, status);
  }

  checkAllCheckbox(status) {
    const allCheckbox = [
      this.checkboxCookieTutor,
      this.checkboxCookiePupil,
      this.checkboxLowSpeedTutor,
      this.checkboxLowSpeedPupil,
      this.checkboxBrowserTutor,
      this.checkboxBrowserPupil,
      this.checkboxMobileOfTutor,
      this.checkboxBrowserMobilePupil,
      this.checkboxHardwareTutor,
      this.checkboxHardwarePupil,
      this.checkboxServiceTutor,
      this.checkboxServicePupil,
      this.checkboxOnpTutor,
      this.checkboxCompPupil,
      this.checkboxTrueCallTutor,
      this.checkboxTrueCallPupil
    ];

    if (status === `be.checked`) {
      allCheckbox.forEach((checkbox) => {
        checkbox.click();
        checkbox
          .should("be.visible")
          .should(status);
      });
    } else {
      allCheckbox.forEach((checkbox) => {
        checkbox
          .should("be.visible")
          .should(status);
      });
    }


    return this;
  }

}

export default new OptionalRecs();
