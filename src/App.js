import "./App.css";
import Header from "./components/Header";
import LessonInfo from "./components/LessonInfo";
import OptionalRecs from "./components/OptionalRecs";
import ResumeField from "./components/ResumeField";
import React from "react";

function App() {
  const [lesson, setLesson] = React.useState(null);
  const handleCreateLesson = (formValues) => {
    const lesson = {
      dateLesson: formValues.dateLessonInput,
      nameTutor: formValues.nameTutorInput,
      namePupil: formValues.namePupilInput,
      idPupil: formValues.idPupilInput,
      statusLesson: formValues.statusLessonToggle
    };
    setLesson(lesson);
  };
  return (
    <div className="App">
      <Header />
      <div>
        <div className="container">
          <div className="row">
            <div className="col-lg-4">
              <div className="row">
                <div className="col-lg-12">
                  <LessonInfo onCreateLesson={formValues => handleCreateLesson(formValues)} />
                </div>
                <div className="col-lg-12">
                  <OptionalRecs />
                </div>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="row">
                <div className="col-lg-12">
                  <ResumeField />
                </div>
                <div className="col-lg-12">
                  <ResumeField />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <button type="button" className="btn btn-primary btn-lg w-200 mx-auto mx-lg-0 mt-10"
                onClick={() => console.log(lesson)}>Создать
        </button>
      </div>
      <div className="d-flex justify-end" style={{ color: "white" }}>
        Создал VaultBoy специально для ТП Тетрики, апрель 2023г.
      </div>
    </div>
  );
}

export default App;
