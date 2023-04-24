import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="d-flex align-center p-40">
        <div className="headerLogo justify-center d-flex align-center">
          <img width={120} src="img/logo-generator.png" alt="Logo" />
        </div>
        <div className="d-flex ml-50">
          <p className="titleGen">Генератор резюмирования by VaultBoy</p>
        </div>
      </header>
      <div className="d-flex align-center">
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
            <input className="form-control" id="exampleFormControlInput1" placeholder="ID ученика" />
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

      <div className="d-flex align-center">
        <ul>
          <p className="lessonInfo d-flex">
            Доп. рекомендации (опционально)
          </p>
          <p className="lessonInfo d-flex justify-between">
            <div>У</div>
            <div>П</div>
          </p>
          <p>
            <div className="form-check lessonInfo d-flex justify-between">
              <input className="form-check-input" type="checkbox" id="inlineCheckbox1" value="option1" />
              <label className="form-check-label mr-25" htmlFor="inlineCheckbox1">Низкая скорость интернета</label>
              <input className="form-check-input" type="checkbox" id="inlineCheckbox2" value="option1" />
            </div>
          </p>
        </ul>
      </div>
    </div>
  );
}

export default App;
