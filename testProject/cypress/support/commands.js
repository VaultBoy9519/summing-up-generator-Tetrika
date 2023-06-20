import "cypress-clipboard";

Cypress.Commands.add("getClipboard", () => {
  cy.window().then((win) => {
    const clipboardData = win.navigator.clipboard;
    return clipboardData.readText();
  });
});

Cypress.Commands.add("postAuth", () => {
  cy.clearCookie("login");
  cy.request({
    method: "POST",
    url: "https://tetrika-school.ru/auth/email_login",
    form: true,
    body: {
      email: "vadim.bykadorov@tetrika.school",
      password: "c9UkJmdL",
      action: "enter"
    }
  });
});


