let isWaitingForResponse = false; // Флаг, указывающий, что мы ждем ответа

window.addEventListener("message", (event) => {
  if (event.source !== window) {
    return;
  }

  if (event.data.type !== "FROM_PAGE" && event.data.type !== "FROM_PAGE_COMPENS") {
    return;
  }

  if (isWaitingForResponse) { // Если уже ждем ответа, игнорируем запрос
    return;
  }

  isWaitingForResponse = true; // Устанавливаем флаг, что мы отправили запрос

  if (event.data.type === "FROM_PAGE") {
    chrome.runtime.sendMessage({ type: "FROM_CONTENT", data: event.data.data }, (response) => {
      isWaitingForResponse = false; // Сбрасываем флаг после получения ответа
      window.postMessage({ type: "FROM_CONTENT", data: response }, "*");
    });
  } else {
    chrome.runtime.sendMessage({ type: "FROM_CONTENT_COMPENS", data: event.data.data }, (response) => {
      isWaitingForResponse = false; // Сбрасываем флаг после получения ответа
      window.postMessage({ type: "FROM_CONTENT_COMPENS", data: response }, "*");
    });
  }
});

window.postMessage({ type: "CONTENT_SCRIPT_LOADED" }, "*");