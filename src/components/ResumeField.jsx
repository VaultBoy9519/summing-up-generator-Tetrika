import React from "react";
import ClipboardJS from "clipboard";
import AppContext from "./AppContext";

const ResumeField = ({
                       userRole,
                       message,
                       renewMessage,
                       renew,
                       emailUser,
                       chatId,
                       lessonStatus,
                       blStatus,
                       postBl,
                       postMessage,
                       postMessageStatus
                     }) => {
  const copyButtonTextRef = React.useRef(null);
  const copyButtonEmailRef = React.useRef(null);
  const [textIsCopied, setTextIsCopied] = React.useState(false);
  const [emailIsCopied, setEmailIsCopied] = React.useState(false);
  const [messageText, setMessageText] = React.useState("");

  const setClasses = (standart, status) => {
    return `${standart}  ${(() => {
      if (status >= 200 && status < 400) {
        return "btn-success";
      } else if (status >= 400) {
        return "btn-danger";
      } else if (status === "Уже отправлено") {
        return "btn-warning";
      }
      return "btn-secondary";
    })()}`;
  };

  const copyInfo = (setter, ref) => {
    const clipboard = new ClipboardJS(ref.current);
    clipboard.on("success", () => {
      setter(true);
      setTimeout(() => {
        setter(false);
      }, 1000);
    });
    return () => {
      clipboard.destroy();
    };
  };

  React.useEffect(() => {
    copyInfo(setTextIsCopied, copyButtonTextRef);
    copyInfo(setEmailIsCopied, copyButtonEmailRef);
  }, []);

  React.useEffect(() => {
    setMessageText(message);
    if (renew === true) {
      setMessageText(message);
    }
  }, [message, renew]);


  React.useEffect(() => {
    if (messageText !== message) {
      renewMessage(message, messageText);
    }
  }, [message, messageText]);

  const handleText = (event) => {
    setMessageText(event.target.value);
  };

  const greenOkSvg = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="16" height="16">
      <path
        d="M434.8 49 174.2 309.7l-97.4-97.4L0 289.2l174.1 174.1 22.5-22.4 315.1-315.1L434.8 49z"
        style={{ fill: "#41ad49" }}
      />
    </svg>
  );

  const copySvg = (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clipboard"
         viewBox="0 0 16 16">
      <path
        d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
      <path
        d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
    </svg>
  );

  return (
    <AppContext.Provider value={{ greenOkSvg }}>
      <div>
        <div className="card">
          <div className="d-flex justify-between border">
            <h5 className="ml-10 mt-5">Для {userRole}{chatId && <a
              href={`https://tetrika-school.ru/chat/${chatId}`}
              target="_blank">(ЧАТ)</a>}</h5>
            <div>
              <button style={userRole === "П" || lessonStatus !== "7" ? { display: "none" } : {}}
                      className={setClasses("btn mr-10 btn-bl", blStatus)}
                      onClick={postBl}
                      name="sendBL">
                БУ
              </button>
              <div className="btn-group" role="group" aria-label="Basic example">
                <button type="button" style={{ minWidth: "30px", maxWidth: "100px" }}
                        className={setClasses("btn btn-email", postMessageStatus)}
                        onClick={postMessage}>Отп.в чат
                </button>
                <button ref={copyButtonEmailRef} className="btn btn-email btn-secondary"
                        name="copyEmailButton"
                        data-clipboard-text={emailUser}>
                  {emailIsCopied ? `Email скопирован!` : emailUser === "" ? "Email" : emailUser}
                </button>
              </div>


              <a ref={copyButtonTextRef} className="btn btn-secondary ml-10"
                 name="copyTextButton"
                 data-clipboard-text={messageText}>
                {textIsCopied ? greenOkSvg : copySvg}
              </a>
            </div>
          </div>
          <></>
          <textarea className="textarea" value={messageText}
                    onChange={handleText}></textarea>
        </div>
      </div>
    </AppContext.Provider>
  );
};

export default ResumeField;