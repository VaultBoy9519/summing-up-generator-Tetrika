import React from "react";
import ClipboardJS from "clipboard";

const ResumeField = ({ userRole, message, renewMessage, renew }) => {
  const copyButtonRef = React.useRef(null);
  const [isCopied, setIsCopied] = React.useState(false);
  const [messageText, setMessageText] = React.useState("");

  React.useEffect(() => {
    const clipboard = new ClipboardJS(copyButtonRef.current);
    clipboard.on("success", () => {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 1000);
    });
    return () => {
      clipboard.destroy();
    };
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
    <div>
      <div className="card">
        <div className="d-flex justify-between border">
          <h5 className="ml-10 mt-5">Резюмирование для {userRole}</h5>
          <a ref={copyButtonRef} className="btn btn-outline-secondary" data-clipboard-text={messageText}>
            {isCopied ? greenOkSvg : copySvg}
          </a>
        </div>
        <></>
        <textarea className="form-control textarea" disabled={message === ""} value={messageText}
                  onChange={handleText}></textarea>
      </div>
    </div>
  );
};

export default ResumeField;