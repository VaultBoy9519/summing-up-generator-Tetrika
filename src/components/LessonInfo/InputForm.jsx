import React from "react";
import AppContext from "../AppContext";

const InputForm = ({ nameInput, text }) => {
  const { color, handleInputChange } = React.useContext(AppContext);

  return (
    <div style={{ width: "100%" }}>
      <input className="form-control"
             style={{ backgroundColor: color[nameInput] }}
             name={nameInput}
             placeholder={color[nameInput] === "white" ? text : "Введите значение"}
             onChange={handleInputChange} />
    </div>
  );
};

export default InputForm;