import React from "react";
import AppContext from "../AppContext";

const Checkbox = ({ text, nameTutor, namePupil }) => {
  const { handleCheckboxChange, optRecs } = React.useContext(AppContext);

  return (
    <div className="form-check d-flex justify-between">
      <input className="form-check-input check-optRec" type="checkbox" checked={optRecs[nameTutor] || ""}
             name={nameTutor}
             value="option1"
             onChange={handleCheckboxChange} />
      <label className="form-check-label mr-25" htmlFor="inlineCheckbox1">{text}</label>
      <input className="form-check-input check-optRec" type="checkbox"
             checked={optRecs[namePupil] || ""}
             name={namePupil}
             value="option1"
             onChange={handleCheckboxChange} />
    </div>

  );
};

export default Checkbox;