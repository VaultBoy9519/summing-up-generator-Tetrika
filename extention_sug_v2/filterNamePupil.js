const filterNamePupil = (name) => {
  const filterWords = ["none", "ноне", "не", "звонить", "вход", "ватсап", "ватсапа", "телеграм", "телеграма", "только", "возможно", "номер"];
  const filterRoles = ["ученик", "ученица", "у", "уч", "сын", `дочь`, "ребенок", "ребёнок"];
  const filterFamily = ["папа", "мама", "родитель", "дедушка", "бабушка", "опекун", "родитель"];
  const namesYA = ["агафя", "аксиня", "анися", "даря", "лукеря", "наталя", "прасковя", "софя"];
  const namesIA = ["эленя", "валеря", "меланя", "юля"];
  const namesUnique = {
    "элена": "елена",
    "василы": "василий",
    "мариа": "мария",
    "олга": "ольга",
    "оxана": "оксана"
  };

  const replaceUniqueName = (item) => {

    let cyrillicItem = (/^[a-zA-Z]*$/.test(item)) ? cyrillicToTranslit().reverse(item, " ") : item;

    if (namesYA.includes(cyrillicItem)) {
      return cyrillicItem.replace("я", "ья");
    } else if (namesIA.includes(cyrillicItem)) {
      return cyrillicItem.replace("я", "ия");
    } else {
      for (let key in namesUnique) {
        if (key === cyrillicItem) {
          return namesUnique[key];
        }
      }
      return cyrillicItem;
    }
  };

  const filterForItem = (item, array) => {
    return !array.includes(item);
  };

  let cleanedName = name
    .replace(/\s*\([^)]*\)/, "")
    .replace(/[^a-zA-Zа-яА-Я0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .split(" ")
    .map(item => (replaceUniqueName(item)))
    .filter(item => filterForItem(item, filterWords));
  console.log(cleanedName);
  if (cleanedName.some(item => filterFamily.includes(item))) {
    const index = cleanedName.indexOf(cleanedName.filter(item => filterFamily.includes(item)).toString());
    if (filterRoles.includes(cleanedName[0])) {
      console.log(`Первый сценарий - вначале слово ученик, удаляется все после имени`);
      cleanedName.splice(2, cleanedName.length - 2);
      cleanedName = cleanedName.filter(item => filterForItem(item, filterRoles));
    } else if (filterRoles.includes(cleanedName[index + 1])) {
      console.log(`Второй сценарий - есть кто-то из семьи, удаляется все, что слева, т.к. после семьи сразу идет "ученик"`);
      cleanedName.splice(0, index + 2);
    } else {
      console.log(`Третий сценарий - проверяем наличие слова ученик и т д`);
      const indexRole = cleanedName.indexOf(cleanedName.filter(item => filterRoles.includes(item)).toString());
      if (indexRole !== -1) {
        console.log(`есть ролевое слово - удаляем все, включая ролевое слово`);
        cleanedName.splice(index, indexRole + 1);
      } else if (index !== 0) {
        console.log(`Сначала идет имя ученика, потом родитель, удаляем все с родителем`);
        cleanedName.splice(index, cleanedName.length - index);
      } else {
        console.log(`упоминания ученика нет - удаляем все`);
        cleanedName = [];
      }
    }
  } else {
    cleanedName.splice(1, cleanedName.length - 1);
  }
  let upperCleanedName = cleanedName
    .filter(item => filterForItem(item, filterRoles))
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return upperCleanedName;

};