import "../support/commands";

class ResumeFieldTutor {

  get resumeField() {
    return cy.get("div.resumeTutor").as("resumeField");
  }

  get copyEmailButton() {
    return this.resumeField.find("[name=copyEmailButton]");
  }

  get copyTextButton() {
    return this.resumeField.find("[name=copyTextButton]");
  }

  get resumeTextarea() {
    return this.resumeField.find("textarea");
  }

  checkResumeTextarea(text) {
    this.resumeTextarea.should("contain.text", text);
    return this;
  }

  clickCopyEmail() {
    this.copyEmailButton
      .should("not.have.attr", "disabled")
      .click();
    this.copyEmailButton
      .invoke("text")
      .then((text) => {
        cy.getClipboard().should("contain", text);
        return this;
      });
  }

  clickCopyText(textNotEmpty) {
    this.resumeField.find("a[name='copyTextButton'] svg")
      .invoke("attr", "viewBox")
      .as("svgElement");

    cy.get("@svgElement")
      .should("equal", "0 0 16 16");

    this.copyTextButton
      .should("be.visible")
      .click();

    if (textNotEmpty === true) {
      cy.get("@svgElement")
        .should("not.equal", "0 0 16 16")
        .should("equal", "0 0 512 512");

      cy.get("@svgElement")
        .should("equal", "0 0 16 16");
    } else {
      cy.get("@svgElement")
        .should("not.equal", "0 0 512 512")
        .should("equal", "0 0 16 16");
    }

    return this;
  }

}

export default new ResumeFieldTutor();