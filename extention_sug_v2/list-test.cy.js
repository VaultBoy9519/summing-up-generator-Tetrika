describe("list-test", () => {
  beforeEach(() => {
    cy.postAuth("valerii51@gmail.com", "Admin123$$$");
    const baseUrl =
      "https://develop.k8s.tetrika-school.ru/adminka/lessons/9f943b40-ac10-4c5b-bbbe-69ab81f4f765";
    const url = `${baseUrl}/events`;
    cy.visit(url);
  });
  it("Тест Просмотра журнала по предмету \"история\"", () => {
    const getDocumentHtml = (link) => {
      const docCreator = (html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        return doc;
      };

      try {
        return fetch(link).then((response) => {
          if (response.status == 403) {
            console.log("Ошибка 403");
            return fetch("https://tetrika-school.ru/go_back%22")
              .then(() => {
                console.log("Повторный запрос");
                return fetch(link);
              })
              .then((response) => response.text())
              .then((html) => docCreator(html));
          }
          return response.text().then((html) => docCreator(html));
        });
      } catch (error) {
        console.log("Урок не найден");
        return error;
      }
    };


  });
});
