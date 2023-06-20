class MainButtons {

  mainButtons(name) {
    cy.get("div.mainButtons").as("mainButtons");
    return cy.get("@mainButtons").find(`[name=${name}]`);
  }

  get createButton() {
    return this.mainButtons("createButton");
  }

  get clearButton() {
    return this.mainButtons("clearButton");
  }

  get testButton() {
    return this.mainButtons("testButton");
  }

  clickCreateButton() {
    this.createButton
      .should("be.visible")
      .click();
    return this;
  }

  clickClearButton() {
    this.clearButton
      .should("be.visible")
      .click();
    return this;
  }

  checkTestButton() {
    this.testButton
      .should("not.be.visible");
    return this;
  }

}

export default new MainButtons();