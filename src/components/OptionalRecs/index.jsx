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
  }, [optRecs]);

  React.useEffect(() => {
    onCheckOptRecs(checkboxValues);
  }, [checkboxValues]);

  //при выборе чекбокса, его значение будет менять состояние checkboxValue на противоположное
  const handleCheckboxChange = (event) => {
    const name = event.target.name;
    const isChecked = event.target.checked;

    if (name === "checkBrowserMobilePupil" && isChecked) {
      setCheckboxValues({ ...optRecs, [name]: true, checkBrowserPupil: false });
    } else if (name === "checkBrowserPupil" && isChecked) {
      setCheckboxValues({ ...optRecs, [name]: true, checkBrowserMobilePupil: false });
    } else {
      setCheckboxValues({ ...optRecs, [name]: isChecked });
    }

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


  return (
    <AppContext.Provider value={{ handleCheckboxChange, optRecs }}>
      <div>
        <div className="otherInfo d-flex align-end justify-between p-1">
          <div>П</div>
          <div className="lessonInfo mb-0">Рекомендации</div>
          <div>У</div>
        </div>
        <div className="otherInfo">
          {checkboxesList}
        </div>
      </div>
    </AppContext.Provider>
  );
};

export default OptionalRecs;