// fetch("https://api.teleport.org/api/cities/?search=russia&country_set=RU")
//   .then(response => response.json())
//   .then(data => {
//     const cities = data._embedded["city:search-results"].map(result => {
//       return {
//         name: result.matching_full_name,
//         id: result._links["city:item"].href.split("/").pop()
//       };
//     });
//     console.log(cities);
//   })
//   .catch(error => console.error(error));


for (let i = 0; i < 10; i++) {
  console.log("+7" + Math.floor(Math.random() * 10000000000).toString().padStart(12, "0")); // пример вывода: "+71234567890"
}
