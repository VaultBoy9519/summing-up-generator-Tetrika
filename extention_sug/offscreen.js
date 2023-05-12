chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  if (request.type !== "FROM_SERVICE_WORKER") {
    return;
  }

  const html = request.data.data;
  const docCreator = () => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    return `Сообщение`;
  };
  docCreator.then(sendResponse, (error) => {
    console.log(error);
  });
  return true;
});