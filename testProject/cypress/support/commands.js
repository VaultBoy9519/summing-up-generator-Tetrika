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
      email: "",
      password: "",
      action: "enter"
    }
  });
});

Cypress.Commands.add("startListeningToExtensionMessages", () => {
  cy.window().then((win) => {
    win.addEventListener("message", (event) => {
      const { data } = event;
      if (data.action === "getCookieValue") {
        const cookieName = data.cookieName;
        cy.getCookie(cookieName).then((cookie) => {
          const cookieValue = cookie ? cookie.value : null;
          win.postMessage({ value: cookieValue }, event.origin);
        });
      }
    });
  });
});