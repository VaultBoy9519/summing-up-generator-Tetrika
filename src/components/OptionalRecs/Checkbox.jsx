import React from "react";

const Checkbox = ({ handleCheckboxChange, text, nameTutor, namePupil }) => {
  return (
    <div className="form-check d-flex justify-between mb-5">
      <input className="form-check-input" type="checkbox" name={nameTutor} value="option1"
             onChange={handleCheckboxChange} />
      <label className="form-check-label mr-25" htmlFor="inlineCheckbox1">{text}</label>
      <input className="form-check-input" type="checkbox" name={namePupil} value="option1"
             onChange={handleCheckboxChange} />
    </div>
  );
};

export default Checkbox;