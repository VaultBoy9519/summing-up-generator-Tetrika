import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="d-flex align-center p-20 ml-20">
        <div className="headerLogo justify-center d-flex align-center">
          <img width={120} src="img/logo-generator.png" alt="Logo" />
        </div>
        <div className="d-flex ml-50">
          <p className="titleGen">Генератор резюмирования by VaultBoy</p>
        </div>
      </header>
      <div className="first"></div>
      <div className="row">
        <div className="col-6">
          <ul>
            <p className="lessonInfo">
              Информация об уроке
            </p>
            <p>
              <input className="form-control" id="exampleFormControlInput1" placeholder="Дата и время урока" />
            </p>
            <p>
              <input className="form-control" id="exampleFormControlInput1" placeholder="ИО преподавателя" />
            </p>
            <p className="d-flex">
              <input className="form-control" id="exampleFormControlInput1" placeholder="Имя ученика" />
              <input className="form-control ml-15" id="exampleFormControlInput1" placeholder="ID ученика" />
            </p>
            <p>
              <select className="form-select" aria-label="Пример выбора по умолчанию">
                <option selected>Статус урока</option>
                <option value="1">Неявка У (РУ)</option>
                <option value="2">Неявка У (ВУ)</option>
                <option value="3">Неявка П (РУ)</option>
                <option value="4">Неявка П (ВУ)</option>
                <option value="5">Отмена (ВНН)</option>
                <option value="6">Отмена (ТПсДС)</option>
              </select>
            </p>
          </ul>
        </div>

        <div className="col-6">
          <p className="lessonInfo">
            Резюмирование У
          </p>
          <p>

            <div className="card">
              <div className="d-flex justify-between border">
                <h5 className="ml-5 mt-5">Резюмирование ученику</h5>
                <a className="btn btn-outline-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                       className="bi bi-clipboard" viewBox="0 0 16 16">
                    <path
                      d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
                    <path
                      d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
                  </svg>
                </a>
              </div>
              <div className="card-body">
                <p className="card-text" style={{ height: "150px", overflow: "auto" }}>Здравствуйте,
                  [user_full_name].
                  Техподдержка Тетрики снова на связи!

                  На недавнем уроке у вас возникли сложности, так как используемый вами браузер не подходит для занятий.
                  Используйте, пожалуйста, Google Chrome или Mozilla Firefox. Скачать их вы можете по этим ссылкам:

                  Google Chrome: https://www.google.com/intl/ru/chrome/
                  Mozilla Firefox: https://www.mozilla.org/ru/firefox/new/

                  Для устройств от компании Apple вы можете использовать стандартный браузер Safari.

                  Более подробно с установкой браузера вы можете ознакомиться в этих статьях:
                  https://tetrikasupp.notion.site/Windows-bcc2b1b95f4849d59bf8a9024e011f37
                  https://tetrikasupp.notion.site/Mac-ff3f6f8346e541669122d88def2042b4

                  Если я чем-то еще могу вам помочь, напишите, пожалуйста, в чат поддержки личного кабинета. Также вы
                  можете нажать на кнопку в уроке "Сообщить о тех. проблеме". Я или мой коллега оперативно придем к вам
                  на помощь. Кнопка расположена в разделе "Чат с поддержкой", рядом с кнопкой "Чат с репетитором".
                </p>
              </div>
            </div>
          </p>
        </div>
      </div>

      <div className="row">
        <div className="col-6">
          <ul>
            <p className="lessonInfo d-flex">
              Доп. рекомендации (опционально)
            </p>
            <p className="lessonInfo d-flex justify-between">
              <div>П</div>
              <div>У</div>
            </p>
            <p>
              <div className="form-check lessonInfo d-flex justify-between">
                <input className="form-check-input" type="checkbox" id="inlineCheckbox1" value="option1" />
                <label className="form-check-label mr-25" htmlFor="inlineCheckbox1">Низкая скорость интернета</label>
                <input className="form-check-input" type="checkbox" id="inlineCheckbox2" value="option1" />
              </div>
            </p>
            <p>
              <div className="form-check lessonInfo d-flex justify-between">
                <input className="form-check-input" type="checkbox" id="inlineCheckbox1" value="option1" />
                <label className="form-check-label mr-25" htmlFor="inlineCheckbox1">Нерекомендуемый браузер</label>
                <input className="form-check-input" type="checkbox" id="inlineCheckbox2" value="option1" />
              </div>
            </p>
            <p>
              <div className="form-check lessonInfo d-flex justify-between">
                <input className="form-check-input" type="checkbox" id="inlineCheckbox1" value="option1" />
                <label className="form-check-label mr-25" htmlFor="inlineCheckbox1">Несоответствие мин.треб.</label>
                <input className="form-check-input" type="checkbox" id="inlineCheckbox2" value="option1" />
              </div>
            </p>
            <p>
              <div className="form-check lessonInfo d-flex justify-between">
                <input className="form-check-input" type="checkbox" id="inlineCheckbox1" value="option1" />
                <label className="form-check-label mr-25" enabled htmlFor="inlineCheckbox1">Передача П в ОНП на
                  ТО</label>
                <input className="form-check-input" type="checkbox" id="inlineCheckbox2" disabled value="option1" />
              </div>
            </p>
            <p>
              <div className="form-check lessonInfo d-flex justify-between">
                <input className="form-check-input" type="checkbox" id="inlineCheckbox1" value="option1" />
                <label className="form-check-label mr-25" enabled htmlFor="inlineCheckbox1">Удалось дозвониться?</label>
                <input className="form-check-input" type="checkbox" id="inlineCheckbox2" value="option1" />
              </div>
            </p>
          </ul>
        </div>
        <div className="col-6">
          <p className="lessonInfo">
            Резюмирование П
          </p>
          <p>

          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
