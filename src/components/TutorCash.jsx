import React from "react";
import { useCopyButton } from "./hooks/useCopyButton";


export const TutorCash = ({ tutorCash, messageCompens }) => {
  const { isCopied, copyButtonRef, copyInfo } = useCopyButton();

  React.useEffect(() => {
      copyInfo();
    }
  );

  return (
    <div className="input-group mb-10">
      <span className="input-group-text">₽</span>
      <span className="input-group-text" style={{ fontWeight: "bold" }}>{isNaN(tutorCash) ? 0 : tutorCash}</span>
      <input className="form-control" defaultValue={messageCompens || ""}
             placeholder="Сумма на доплату + текст для компенса преподу" />
      <button ref={copyButtonRef} className="btn btn-secondary" style={{ width: "125px" }}
              data-clipboard-text={messageCompens}>
        {isCopied ? `Скопировано` : `Копировать`}
      </button>
    </div>
  );
};
