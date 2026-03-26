import { useState, useRef, useEffect } from "react";

export const MessageField = () => {
  const [selectionStart, setSelectionStart] = useState(false);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const span = spanRef.current;

    const selectionStartCallback = () => {
      console.log("start");
      setSelectionStart(true);
    };

    span?.addEventListener("selectstart", selectionStartCallback);

    return () => {
      span?.removeEventListener("selectstart", selectionStartCallback);
    };
  }, []);

  useEffect(() => {
    const onSelectionChange = () => {
      const selection = window.getSelection()?.toString().trim();
      if (selection && selectionStart && !popoverVisible) {
        setPopoverVisible(true);
      }
    };

    document.addEventListener("selectionchange", onSelectionChange);
    return () =>
      document.removeEventListener("selectionchange", onSelectionChange);
  }, [popoverVisible, selectionStart]);

  const handleNewTags = (tag: "b" | "u" | "i") => {
    console.log(tag);
    const selection = window.getSelection();
    if (selection?.isCollapsed) {
      alert("Please select some text first.");
      return;
    }

    const range = selection?.getRangeAt(0);
    const newTag = document.createElement(tag);

    try {
      range?.surroundContents(newTag);
      selection?.removeAllRanges();
    } catch {
      document.execCommand("bold", false, undefined);
    } finally {
      setSelectionStart(false);
      setPopoverVisible(false);
    }
  };

  return (
    <div className="relative">
      {popoverVisible && (
        <div className="absolute -top-7 flex gap-2 bg-zinc-400">
          <button
            className="bg-zinc-200 rounded px-2 hover:cursor-pointer"
            onClick={() => {
              handleNewTags("b");
            }}
            title="ctrl+b"
          >
            <b>b</b>
          </button>
          <button
            className="bg-zinc-200 rounded px-2 hover:cursor-pointer"
            onClick={() => handleNewTags("u")}
            title="ctrl+u"
          >
            <u>u</u>
          </button>
          <button
            className="bg-zinc-200 rounded px-2 hover:cursor-pointer"
            onClick={() => handleNewTags("i")}
            title="ctrl+i"
          >
            <i>i</i>
          </button>
        </div>
      )}
      <span
        ref={spanRef}
        contentEditable
        className="bg-teal-300 block w-[300px] h-[100px]"
        role="textbox"
      />
    </div>
  );
};
