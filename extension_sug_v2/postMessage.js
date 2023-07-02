const postMessage = (payloadOptions) => {
  return new Promise((resolve, reject) => {

    let resultStatus;

    fetch("https://mmost.tetrika-school.ru/api/v4/posts", payloadOptions)
      .then(response => {
        resultStatus = response.status;
        console.log(resultStatus);
        resolve(resultStatus);
      })
      .catch((error) => {
        reject(error);
      });
  });
};