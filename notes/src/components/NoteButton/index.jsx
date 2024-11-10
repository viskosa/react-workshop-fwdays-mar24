import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import { format } from "date-fns";
import "./index.css";
import { memo, useLayoutEffect, useRef } from "react";

function NoteButton({ isActive, onNoteActivated, id, text, filterText, date }) {
  const noteHeader = useRef();

  useLayoutEffect(() => {
    if (noteHeader.current) {
      // here we have layout thrashing:
      // it checks the width of note header and if it doesn't fit the width of note, it will add shadow to the right
      if (noteHeader.current.scrollWidth > noteHeader.current.clientWidth) { // read from the DOM
        // we're going to delay writes to the layout to the end of the frame
        // noteHeader.current.classList.add("notes-list__note-header_overflowing"); // write to the DOM
        // 1 - requestAnimationFrame is going to move animation to the end of the current task(frame) - prefferable solution
        requestAnimationFrame(() => {
          noteHeader.current.classList.add("notes-list__note-header_overflowing");
        })
        // 2 - setTimeout is going to move animation at the beginning of the next frame
        // setTimeout(() => {
        //   noteHeader.current.classList.add("notes-list__note-header_overflowing");
        // }, 0)
      } else {
        // noteHeader.current.classList.remove(
        //   "notes-list__note-header_overflowing"
        // );
        requestAnimationFrame(() => {
          noteHeader.current.classList.remove(
            "notes-list__note-header_overflowing"
          );
        })
        // setTimeout(() => {
        //   noteHeader.current.classList.remove(
        //     "notes-list__note-header_overflowing"
        //   );
        // }, 0)
      }
    }
  }, [text]);

  const className = [
    "notes-list__button",
    "notes-list__note",
    isActive && "notes-list__note_active",
  ]
    .filter((i) => i !== false)
    .join(" ");

  return (
    <button className={className} onClick={() => onNoteActivated(id)}>
      <span className="notes-list__note-meta">
        {format(date, "d MMM yyyy")}
      </span>
      <span className="notes-list__note-header" ref={noteHeader}>
        {generateNoteHeader(text, filterText)}
      </span>
    </button>
  );
}

function generateNoteHeader(text, filterText) {
  let firstLine = text
    .split("\n")
    .map((i) => i.trim())
    .filter((i) => i.length > 0)[0];

  // Wrap the filter text with a `<mark>` tag.
  // (The algorithm below is a bit buggy: if the note itself has any `~~something~~` entries,
  // they will be turned into `<mark>` as well. But this is alright for demo purposes.)
  let componentsMapping = {};
  if (
    filterText &&
    firstLine.toLowerCase().includes(filterText.toLowerCase())
  ) {
    // If `filterText` is `aa`, this splits `bbbbaacccaac` into ['bbb', 'aa', 'ccc', 'aa', 'c']
    // Based on example 2 in https://stackoverflow.com/a/25221523/1192426
    const firstLineParts = firstLine.split(
      new RegExp(
        "(" + filterText.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&") + ")",
        "gi"
      )
    );

    // This wraps all `filterText` entries with a `del` tag.
    // ['bbb', 'aa', 'ccc', 'aa', 'c'] => ['bbb', '~~aa~~', 'ccc', '~~aa~~', 'c'] => 'bbb~~aa~~ccc~~aa~~c'
    firstLine = firstLineParts
      .map((part) => {
        if (part.toLowerCase() === filterText.toLowerCase()) {
          return `~~${part}~~`;
        }

        return part;
      })
      .join("");

    // This ensures that all `filterText` entries are actually wrapped with `mark`, not with `del`
    componentsMapping = {
      del: "mark",
    };
  }

  return (
    <ReactMarkdown
      remarkPlugins={[gfm]}
      disallowedElements={["p", "h1", "h2", "h3", "h4", "h5", "h6"]}
      unwrapDisallowed={true}
      components={componentsMapping}
    >
      {firstLine}
    </ReactMarkdown>
  );
}

export default memo(NoteButton);
