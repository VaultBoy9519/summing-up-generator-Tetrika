import React from "react";
import Checkbox from "./Checkbox";
import { checkboxProps } from "./checkboxProps";
import AppContext from "../AppContext";

const OptionalRecs = ({ optRecs, onCheckOptRecs }) => {
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
    onCheckOptRecs(checkboxValues);
  }, [checkboxValues]);

  //при выборе чекбокса, его значение будет менять состояние checkboxValue на противоположное
  const handleCheckboxChange = (event) => {
    const name = event.target.name;
    setCheckboxValues({ ...checkboxValues, [name]: !(checkboxValues[name]) });
    console.log(event.target.name);
    console.log(checkboxValues);
  };

  function PropsCreator(nameTutor, namePupil, text) {
    this.nameTutor = nameTutor;
    this.namePupil = namePupil;
    this.text = text;
  };


  const checkboxPropsFull = checkboxProps.map(props => new PropsCreator(props.nameTutor, props.namePupil, props.text));
  const checkboxesList = checkboxPropsFull.map((checkbox, index) => {
    return <Checkbox key={index}
                     nameTutor={checkbox.nameTutor}
                     namePupil={checkbox.namePupil}
                     text={checkbox.text}
    />;
  });

  const { testFunction } = React.useContext(AppContext);

  return (
    <AppContext.Provider value={{ handleCheckboxChange }}>
      <div>
        <p className="lessonInfo mt-10 mb-0">
          Доп. рекомендации
        </p>
        <div className="otherInfo d-flex justify-between p-1">
          <div>П</div>
          <div>У</div>
        </div>
        <div className="otherInfo">
          {checkboxesList}
        </div>
        <button type="button"
                style={{ display: "none" }}
                className="btn btn-primary btn-lg w-200 mx-auto mx-lg-0 mt-10 ml-10"
                onClick={testFunction}>Заполнить
        </button>
      </div>
    </AppContext.Provider>
  );
};

export default OptionalRecs;