import React from "react";


export const TutorCash = ({ tutorCash, compensStatus, postCompensTutor }) => {

  const compensMessages = [`Компенсация успешно начислена`, `Компенсация выполнена ранее`, `Не удалось начислить компенсацию`, ""];
  const classesCash = ["input-group-text bg-success border-0", "input-group-text bg-warning border-0", "input-group-text bg-danger border-0", "input-group-text bg-secondary border-0 textColor"];
  const classesButton = ["btn btn-success", "btn btn-warning", "btn btn-danger", "btn btn-secondary"];

  const compensMessage = (arr) => {
    switch (compensStatus) {
      case true:
        return arr[0];
      case "Уже выполнен":
        return arr[1];
      case false:
      case undefined:
        return arr[2];
      default:
        return arr[3];
    }
  };

  return (
    <div className="input-group mb-10">
      <span className={compensMessage(classesCash)}
      >{tutorCash !== "" ? `${tutorCash} ₽` : `₽`}</span>
      <input className="form-control" name="messageCompensText" readOnly
             style={tutorCash !== "" && compensStatus === "" ? { backgroundColor: "orange" } : { backgroundColor: "white" }}
             defaultValue={tutorCash !== "" && compensStatus === "" ? `Требуется начислить компенсацию` : compensMessage(compensMessages)}
             placeholder="Компенсация П не требуется" />


      <button name="postCompensTutor"
              className={compensMessage(classesButton)}
              onClick={postCompensTutor}
      >Компенсировать
      </button>
    </div>

  );
};
