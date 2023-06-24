import React from "react";

const LogAnalyzer = ({ logs, role }) => {

  const setStyle = (element, styles) => {
    return element !== "" && element !== undefined ?
      `bg-danger ${styles}` :
      styles;
  };


  return (
    <div>
      <table className="table table-light table-sm mb-10">
        <tbody>
        <tr>
          <td>Первое действие {role}</td>
          <td className="right">{logs.beginDate !== undefined ? logs.beginDate : ""}</td>
        </tr>
        <tr>
          <td>Последнее действие {role}</td>
          <td className="right">{logs.endDate !== undefined ? logs.endDate : ""}</td>
        </tr>
        <tr>
          <td>{role} был на уроке
          </td>
          <td className="right">
            {
              logs.timeCountInLesson !== undefined && logs.timeCountInLesson !== 0 ?
                `${logs.timeCountInLesson} мин.` :
                logs.timeCountInLesson === 0 ?
                  "Нет" :
                  ""
            }
          </td>
        </tr>
        <tr>
          <td className={
            setStyle(logs.camera, "")
          }>Камера
          </td>
          <td className={
            setStyle(logs.camera, "right")
          }>{logs.camera !== "" ? logs.camera : ""}</td>
        </tr>
        <tr>
          <td
            className={
              setStyle(logs.micro, "")
            }
          >Микрофон
          </td>
          <td
            className={
              setStyle(logs.micro, "right")
            }>{logs.micro !== "" ? logs.micro : ""}</td>
        </tr>
        <tr>
          <td
            className={
              logs.ws_closed !== undefined && logs.ws_closed > 3 ?
                "bg-danger" :
                ""
            }>Разрыв веб-сокетов
          </td>
          <td
            className={
              logs.ws_closed !== undefined && logs.ws_closed > 3 ?
                "bg-danger right" :
                "right"
            }>{logs.ws_closed !== undefined && logs.ws_closed !== 0 ? `${logs.ws_closed} раз` : ""}</td>
        </tr>
        </tbody>
      </table>
    </div>
  );
};

export default LogAnalyzer;