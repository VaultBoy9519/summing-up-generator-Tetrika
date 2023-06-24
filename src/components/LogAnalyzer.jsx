import React from "react";

const LogAnalyzer = ({ logsPupil, role }) => {

  return (
    <div>
      <table className="table table-light table-sm mb-10">
        <tbody>
        <tr>
          <td>Первое действие {role}</td>
          <td className="right">{logsPupil.beginDate !== undefined ? logsPupil.beginDate : ""}</td>
        </tr>
        <tr>
          <td>Последнее действие {role}</td>
          <td className="right">{logsPupil.endDate !== undefined ? logsPupil.endDate : ""}</td>
        </tr>
        <tr>
          <td>{role} был на уроке</td>
          <td className="right">
            {
              logsPupil.timeCountInLesson !== undefined && logsPupil.timeCountInLesson !== 0 ?
                `${logsPupil.timeCountInLesson} мин.` :
                logsPupil.timeCountInLesson === 0 ?
                  "Нет" :
                  ""
            }
          </td>
        </tr>
        <tr>
          <td>Камера</td>
          <td className="right">{logsPupil.camera !== "" ? logsPupil.camera : ""}</td>
        </tr>
        <tr>
          <td>Микрофон</td>
          <td className="right">{logsPupil.micro !== "" ? logsPupil.micro : ""}</td>
        </tr>
        <tr>
          <td>Разрыв веб-сокетов</td>
          <td
            className="right">{logsPupil.ws_closed !== undefined && logsPupil.ws_closed !== 0 ? `${logsPupil.ws_closed} раз` : ""}</td>
        </tr>
        </tbody>
      </table>
    </div>
  );
};

export default LogAnalyzer;