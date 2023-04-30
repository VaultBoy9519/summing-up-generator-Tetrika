import React from "react";

const OptionalRecs = (props) => {
  const checkboxState = {};
  const [checkboxValues, setCheckboxValues] = React.useState(checkboxState);

  //эта логика наполняет объект checkboxState первоначальными значениями
  React.useEffect(() => {
    const elements = document.getElementsByClassName(`form-check-input`);
    for (let element of elements) {
      checkboxState[element.name] = false;
    }
  }, []);

  React.useEffect(() => {
    props.onCheckOptRecs(checkboxValues);
  }, [checkboxValues]);

  //при выборе чекбокса, его значение будет менять состояние checkboxValue на противоположное
  const handleCheckboxChange = (event) => {
    const name = event.target.name;
    setCheckboxValues({ ...checkboxValues, [name]: !(checkboxValues[name]) });
    console.log(event.target.name);
    console.log(checkboxValues);
  };

  return (
    <div>
      <ul>
        <p className="lessonInfo mt-10">
          Доп. рекомендации
        </p>
        <div className="otherInfo d-flex justify-between p-1">
          <div>П</div>
          <div>У</div>
        </div>
        <div className="otherInfo">
          <div className="form-check d-flex justify-between mb-5">
            <input className="form-check-input" type="checkbox" name="checkLowSpeedTutor" value="option1"
                   onChange={handleCheckboxChange} />
            <label className="form-check-label mr-25" htmlFor="inlineCheckbox1">Низкая скорость интернета</label>
            <input className="form-check-input" type="checkbox" name="checkLowSpeedPupil" value="option1"
                   onChange={handleCheckboxChange} />
          </div>
          <div className="form-check d-flex justify-between mb-5">
            <input className="form-check-input" type="checkbox" name="checkBrowserTutor" value="option1"
                   onChange={handleCheckboxChange} />
            <label className="form-check-label mr-25" htmlFor="inlineCheckbox1">Нерекомендуемый браузер</label>
            <input className="form-check-input" type="checkbox" name="checkBrowserPupil" value="option1"
                   onChange={handleCheckboxChange} />
          </div>
          <div className="form-check d-flex justify-between mb-5">
            <input className="form-check-input" type="checkbox" name="checkHardwareTutor" value="option1"
                   onChange={handleCheckboxChange} />
            <label className="form-check-label mr-25" htmlFor="inlineCheckbox1">Несоответствие мин.треб.</label>
            <input className="form-check-input" type="checkbox" name="checkHardwarePupil" value="option1"
                   onChange={handleCheckboxChange} />
          </div>
          <div className="form-check d-flex justify-between mb-5">
            <input className="form-check-input" type="checkbox" name="checkCookieTutor" value="option1"
                   onChange={handleCheckboxChange} />
            <label className="form-check-label mr-25" htmlFor="inlineCheckbox1">Чистка cookie/кеш-файлов</label>
            <input className="form-check-input" type="checkbox" name="checkCookiePupil" value="option1"
                   onChange={handleCheckboxChange} />
          </div>
          <div className="form-check d-flex justify-between mb-5">
            <input className="form-check-input" type="checkbox" name="checkOnpTutor" value="option1"
                   onChange={handleCheckboxChange} />
            <label className="form-check-label mr-25" htmlFor="inlineCheckbox1">Передача П в ОНП / У на компенс</label>
            <input className="form-check-input" type="checkbox" name="checkCompPupil" value="option1"
                   onChange={handleCheckboxChange} />
          </div>
          <div className="form-check d-flex justify-between mb-5">
            <input className="form-check-input" type="checkbox" name="checkTrueCallTutor" value="option1"
                   onChange={handleCheckboxChange} />
            <label className="form-check-label mr-25" enabled htmlFor="inlineCheckbox1">Не удалось дозвониться</label>
            <input className="form-check-input" type="checkbox" name="checkTrueCallPupil" value="option1"
                   onChange={handleCheckboxChange} />
          </div>
        </div>

      </ul>
    </div>
  );
};

export default OptionalRecs;