import React from "react";

const OptionalRecs = () => {
  return (
    <div>
      <ul>
        <p className="lessonInfo">
          Доп. рекомендации
        </p>
        <p className="otherInfo d-flex justify-between">
          <div>П</div>
          <div>У</div>
        </p>
        <div className="otherInfo">
          <p>
            <div className="form-check  d-flex justify-between">
              <input className="form-check-input" type="checkbox" id="inlineCheckbox1" value="option1" />
              <label className="form-check-label mr-25" htmlFor="inlineCheckbox1">Низкая скорость интернета</label>
              <input className="form-check-input" type="checkbox" id="inlineCheckbox2" value="option1" />
            </div>
          </p>
          <p>
            <div className="form-check d-flex justify-between">
              <input className="form-check-input" type="checkbox" id="inlineCheckbox1" value="option1" />
              <label className="form-check-label mr-25" htmlFor="inlineCheckbox1">Нерекомендуемый браузер</label>
              <input className="form-check-input" type="checkbox" id="inlineCheckbox2" value="option1" />
            </div>
          </p>
          <p>
            <div className="form-check d-flex justify-between">
              <input className="form-check-input" type="checkbox" id="inlineCheckbox1" value="option1" />
              <label className="form-check-label mr-25" htmlFor="inlineCheckbox1">Несоответствие мин.треб.</label>
              <input className="form-check-input" type="checkbox" id="inlineCheckbox2" value="option1" />
            </div>
          </p>
          <p>
            <div className="form-check d-flex justify-between">
              <input className="form-check-input" type="checkbox" id="inlineCheckbox1" value="option1" />
              <label className="form-check-label mr-25" enabled htmlFor="inlineCheckbox1">Передача П в ОНП на
                ТО</label>
              <input className="form-check-input" type="checkbox" id="inlineCheckbox2" disabled value="option1" />
            </div>
          </p>
          <p>
            <div className="form-check d-flex justify-between">
              <input className="form-check-input" type="checkbox" id="inlineCheckbox1" value="option1" />
              <label className="form-check-label mr-25" enabled htmlFor="inlineCheckbox1">Удалось дозвониться?</label>
              <input className="form-check-input" type="checkbox" id="inlineCheckbox2" value="option1" />
            </div>
          </p>
        </div>

      </ul>
    </div>
  );
};

export default OptionalRecs;