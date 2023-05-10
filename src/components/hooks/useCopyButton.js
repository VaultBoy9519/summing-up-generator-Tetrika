import React from "react";
import ClipboardJS from "clipboard";

export const useCopyButton = (setter, ref) => {
  const [isCopied, setIsCopied] = React.useState(false);
  const copyButtonRef = React.useRef(null);
  const copyInfo = () => {
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
  };

  return { isCopied, copyButtonRef, copyInfo };
};