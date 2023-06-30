let isWaitingForResponse = false; // Флаг, указывающий, что мы ждем ответа

window.addEventListener("message", (event) => {
  if (event.source !== window) {
    return;
  }

  if (event.data.type !== "FROM_PAGE") {
    return;
  }

  if (isWaitingForResponse) { // Если уже ждем ответа, игнорируем запрос
    return;
  }

  isWaitingForResponse = true; // Устанавливаем флаг, что мы отправили запрос

  chrome.runtime.sendMessage({ type: "FROM_CONTENT", data: event.data.data }, (response) => {
    isWaitingForResponse = false; // Сбрасываем флаг после получения ответа
    console.log(response);
    window.postMessage({ type: "FROM_CONTENT", data: response }, "*");
  });
});

window.postMessage({ type: "CONTENT_SCRIPT_LOADED" }, "*");