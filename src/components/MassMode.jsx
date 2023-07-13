import React from "react";


export const MassMode = ({ massModeParam }) => {

  const [check, setCheck] = React.useState(false);

  const handleCheckMass = (event) => {
    const isChecked = event.target.checked;
    setCheck(isChecked);

    console.log(check);
  };

  React.useEffect(() => {
    massModeParam(check);
  }, [check]);

  return (
    <div className="mt-10 input-group">
      <div className="bg-secondary border-0 input-group-text">
        <input className="form-check-input mt-0" type="checkbox" name="massModeCheck" onChange={handleCheckMass}
               value=""
               aria-label="Checkbox for following text input" />
      </div>
      <span className="bg-secondary border-0 textColor input-group-text">БХ</span>
      <input type="text" className="form-control" disabled={!check} placeholder="Ссылка на тикет"
             aria-label="Text input with checkbox" />
    </div>
  );
};

export default MassMode;