const postCompensTutor = (data, checkCompens) => {
  return new Promise((resolve, reject) => {

    const params = {
      charge: data.cash,
      reason: data.comment,
      additional_info: data.adminName,
      event_id: "",
      lesson_id: data.lessonId,
      action: "new_penalty"
    };

    const requestBody = new URLSearchParams(params);

    const requestOptions = {
      credentials: "include",
      method: "POST",
      body: requestBody,
      redirect: "follow"
    };

    console.log(`requestOpt: `, requestOptions);

    let statusCompens;

    fetch(`https://tetrika-school.ru/adminka/tutors/${data.fullIdTutor}/penalties`, requestOptions)
      .then(response => response.text())
      .then(async result => {
        const tempElement = document.createElement("div");
        tempElement.innerHTML = result;
        statusCompens = await checkCompens(tempElement);
      })
      .catch(error => {
        console.log("error", error);
        statusCompens = false;
      })
      .then(() => {
        console.log(statusCompens);
        resolve(statusCompens);
      })
      .catch((error) => {
        reject(error);
      });
  });
};