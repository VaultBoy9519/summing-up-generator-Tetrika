import "./App.css";
import Header from "./components/Header";
import LessonInfo from "./components/LessonInfo";
import OptionalRecs from "./components/OptionalRecs";
import ResumeField from "./components/ResumeField";

function App() {
  return (
    <div className="App">

      <Header />
      <div>
        <div className="container">
          <div className="row">
            <div className="col-lg-4">
              <div className="row">
                <div className="col-lg-12">
                  <LessonInfo />
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
        <button type="button" className="btn btn-primary btn-lg w-200 mx-auto mx-lg-0 mt-10">Создать</button>
      </div>
      <div className="d-flex justify-end" style={{ color: "white" }}>
        Создал VaultBoy специально для ТП Тетрики, апрель 2023г.
      </div>
    </div>
  );
}

export default App;
