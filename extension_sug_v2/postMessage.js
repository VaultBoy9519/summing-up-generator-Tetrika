const postMessage = (url, payloadOptions) => {
  return new Promise((resolve, reject) => {

    let resultStatus;

    fetch(url, payloadOptions)
      .then(response => {
        console.log(url, response);
        resultStatus = response.status;
        console.log(resultStatus);
        resolve(resultStatus);
      })
      .catch((error) => {
        reject(error);
      });
  });
};