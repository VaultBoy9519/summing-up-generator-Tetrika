import React from "react";

const LogAnalyzer = ({ durationLesson, logs, role }) => {

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
          <td className={
            logs.timeCountInLesson <= durationLesson / 2 && logs.timeCountInLesson >= durationLesson / 4 ?
              "bg-warning" :
              logs.timeCountInLesson <= durationLesson / 4 ?
                "bg-danger" :
                ""
          }>{role} был на уроке
          </td>
          <td className={
            logs.timeCountInLesson <= durationLesson / 2 && logs.timeCountInLesson >= durationLesson / 4 ?
              "bg-warning right" :
              logs.timeCountInLesson <= durationLesson / 4 ?
                "bg-danger right" :
                "right"
          }>
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
            logs.clickButtonTp > 1 ?
              "bg-danger" : logs.clickButtonTp === 1 ?
                "bg-warning" :
                ""
          }>{role} нажал кнопку ТП
          </td>
          <td
            className={
              logs.clickButtonTp > 1 ?
                "bg-danger right" : logs.clickButtonTp === 1 ?
                  "bg-warning right" :
                  "right"
            }>{
            logs.clickButtonTp !== undefined &&
            logs.clickButtonTp !== 0 ?
              `${logs.clickButtonTp} раз` :
              logs.clickButtonTp === 0 ?
                "Нет" :
                ""
          }</td>
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
              logs.ws_closed > 3 ?
                "bg-danger right" :
                "right"
            }>{
            logs.ws_closed !== undefined &&
            logs.ws_closed !== 0 ?
              `${logs.ws_closed} раз` :
              ""
          }</td>
        </tr>
        </tbody>
      </table>
    </div>
  );
};

export default LogAnalyzer;