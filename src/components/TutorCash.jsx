import React from "react";
import { useCopyButton } from "./hooks/useCopyButton";


export const TutorCash = ({ tutorCash, messageCompens, link }) => {

  const greenOkSvg = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="16" height="16">
      <path
        d="M434.8 49 174.2 309.7l-97.4-97.4L0 289.2l174.1 174.1 22.5-22.4 315.1-315.1L434.8 49z"
        style={{ fill: "#41ad49" }}
      />
    </svg>
  );
  const { copyInfo } = useCopyButton();
  const [isCopiedText, setIsCopiedText] = React.useState(false);
  const [isCopiedID, setIsCopiedID] = React.useState(false);

  const copyButtonRefText = React.useRef(null);
  const copyButtonRefID = React.useRef(null);

  React.useEffect(() => {
      copyInfo(copyButtonRefText, setIsCopiedText);
      copyInfo(copyButtonRefID, setIsCopiedID);
    }
  );

  return (
    <div className="input-group mb-10">
      <span className="input-group-text">₽</span>
      <span className="input-group-text" style={{ fontWeight: "bold" }}>{isNaN(tutorCash) ? 0 : tutorCash}</span>
      <input className="form-control" defaultValue={messageCompens || ""}
             placeholder="Сумма на доплату + текст для компенса преподу" />
      <button ref={copyButtonRefText} className="btn btn-secondary" style={{ width: "125px" }}
              data-clipboard-text={messageCompens}>
        {isCopiedText ? `Скопировано` : `Копировать`}
      </button>
      <button ref={copyButtonRefID} className="btn btn-secondary" style={{ width: "40px" }}
              data-clipboard-text={link.includes(`tetrika-school.ru`) ? link.replace("https://tetrika-school.ru/adminka/lessons/", "") : link}>
        {isCopiedID ? greenOkSvg : `ID`}
      </button>
    </div>

  );
};
