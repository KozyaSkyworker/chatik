import { useState, useRef, useEffect } from "react";

interface Props {
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
}

export const MessageField = ({ setNewMessage }: Props) => {
  const [selectionStart, setSelectionStart] = useState(false);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const spanRef = useRef<HTMLSpanElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const span = spanRef.current;

    const selectionStartCallback = () => {
      console.log("start");
      setSelectionStart(true);
    };

    spanRef.current?.focus();

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

  const handleNewTags = (tag: "b" | "u" | "i" | "reset") => {
    console.log("tag", tag);

    const selection = window.getSelection();
    if (selection?.isCollapsed) {
      alert("Please select some text first.");
      return;
    }

    if (tag === "reset" && spanRef.current) {
      selection?.removeAllRanges();
      const reseteddText = spanRef.current.innerHTML.replace(/<[^>]+>/g, "");
      setNewMessage(reseteddText || "");
      spanRef.current.innerHTML = reseteddText || "";
      setSelectionStart(false);
      setPopoverVisible(false);
      return;
    }

    const range = selection?.getRangeAt(0);
    const newTag = document.createElement(tag);

    try {
      range?.surroundContents(newTag);
    } catch {
      selection?.removeAllRanges();
    } finally {
      setNewMessage(spanRef.current?.innerHTML || "");
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLSpanElement>) => {
    const innerHTML = e.target.innerHTML;
    setNewMessage(innerHTML);
  };

  const handleBlur = (e: React.FocusEvent) => {
    if (e.relatedTarget && popoverRef.current?.contains(e.relatedTarget)) {
      return; // still inside popover, keep it open
    }

    setSelectionStart(false);
    setPopoverVisible(false);
  };

  return (
    <div className="relative grow" onBlur={handleBlur}>
      {popoverVisible && (
        <div
          className="absolute -top-7 flex gap-2 bg-zinc-400"
          ref={popoverRef}
        >
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
          <button
            className="bg-zinc-200 rounded px-2 hover:cursor-pointer"
            onClick={() => handleNewTags("reset")}
            title="clear styles"
          >
            clear
          </button>
        </div>
      )}
      <span
        ref={spanRef}
        contentEditable
        className="bg-teal-300 block w-full h-[100px]"
        role="textbox"
        onInput={handleInput}
      />
    </div>
  );
};
