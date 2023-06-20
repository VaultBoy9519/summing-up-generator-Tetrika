import "../support/commands";

class CashComponent {

  componentsCreator(name) {
    cy.get("div.tutorCashComponent").as("tutorCashComponent");
    return cy.get("@tutorCashComponent").find(`[name=${name}]`);
  }

  get copyCashButton() {
    return this.componentsCreator("copyCashButton");
  }

  get messageCompensText() {
    return this.componentsCreator("messageCompensText");
  }

  get copyMessageButton() {
    return this.componentsCreator("copyMessageButton");
  }

  get copyIdButton() {
    return this.componentsCreator("copyIdButton");
  }

  checkMessage(text) {
    this.messageCompensText
      .should("have.text", text);
    return this;
  }

  clickCopyCash(cash) {
    this.copyCashButton
      .should("contain.text", cash)
      .click();
    this.copyCashButton
      .invoke("text")
      .then((cashValue) => {
        cy.getClipboard().should("contain", cashValue);
        return this;
      });
  }

  clickCopyMessage(message) {
    this.copyMessageButton
      .should("be.visible")
      .click();
    cy.getClipboard().should("contain", message);
    return this;
  }

  clickCopyId(id) {
    this.copyIdButton
      .should("be.visible")
      .click();
    cy.getClipboard().should("contain", id);
    return this;
  }

}

export default new CashComponent();