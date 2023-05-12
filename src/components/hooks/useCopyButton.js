import React from "react";
import ClipboardJS from "clipboard";

export const useCopyButton = () => {
  const copyInfo = (ref, setter) => {
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

  return { copyInfo };
};