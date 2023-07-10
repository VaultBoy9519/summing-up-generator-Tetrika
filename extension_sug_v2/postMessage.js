const postMessage = (url, payloadOptions) => {
  return new Promise((resolve, reject) => {

    fetch(url, payloadOptions)
      .then(response => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};