const eventsParser = (
  doc,
  tutorEvents,
  pupilEvents,
  standartDateFormat
) => {
  const element = doc.querySelector(".datetime_me__raw");
  if (element) {
    const parentElements = Array.from(
      doc.querySelectorAll("tr[class]")
    );

    parentElements.forEach((parentElement) => {
      const eventDate = parentElement.querySelector(".datetime_me__raw").innerHTML;

      const formatEventDate = standartDateFormat(eventDate);

      // Значение атрибута innerHTML для элемента .datetime_me__raw
      const sampElements = Array.from(
        parentElement.querySelectorAll("samp")
      ); // Получаем все элементы <samp> и преобразуем коллекцию в массив
      const role = parentElement.querySelector("a").innerText; // Значение роли (Tutor или Pupil)

      const valuesObject = {
        dateTime: formatEventDate,
        description: "",
        role: role
      };

      sampElements.forEach((sampElement) => {
        const description = sampElement.innerHTML; // Значение элемента <samp>
        const cyrillicRegex = /[а-яА-ЯЁё]/; // Регулярное выражение для проверки наличия кириллических символов

        // Проверяем, содержит ли значение элемента <samp> кириллические символы
        if (cyrillicRegex.test(description)) {
          valuesObject.description = description;
        }
      });

      if (role === "tutor") {
        tutorEvents.push(valuesObject);
      } else if (role === "pupil") {
        pupilEvents.push(valuesObject);
      }
    });

    console.log("Tutor Events: ", tutorEvents);
    console.log("Pupil Events: ", pupilEvents);

  } else {
    console.log("Элемент не найден");
  }
  return;
};