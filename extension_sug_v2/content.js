let isWaitingForResponse = false; // Флаг, указывающий, что мы ждем ответа

window.addEventListener("message", (event) => {

  const getAndPost = (type) => {
    chrome.runtime.sendMessage({ type: type, data: event.data.data }, (response) => {
      isWaitingForResponse = false; // Сбрасываем флаг после получения ответа
      window.postMessage({ type: type, data: response }, "*");
    });
  };

  if (event.source !== window) {
    return;
  }

  if (isWaitingForResponse) { // Если уже ждем ответа, игнорируем запрос
    return;
  }

  isWaitingForResponse = true; // Устанавливаем флаг, что мы отправили запрос

  switch (event.data.type) {
    case "FROM_PAGE":
      getAndPost("FROM_CONTENT");
      break;
    case "FROM_PAGE_COMPENS":
      getAndPost("FROM_CONTENT_COMPENS");
      break;
    case "FROM_PAGE_POST-MESSAGE":
      getAndPost("FROM_CONTENT_POST-MESSAGE");
      break;
    case "FROM_PAGE_BL":
      getAndPost("FROM_CONTENT_BL");
      break;
    case "FROM_PAGE_CANCEL":
      getAndPost("FROM_CONTENT_CANCEL");
      break;
    default:
      isWaitingForResponse = false;
      return;
  }
});

window.postMessage({ type: "CONTENT_SCRIPT_LOADED" }, "*");