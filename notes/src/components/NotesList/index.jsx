import { useEffect, useMemo, useRef, useState } from "react";
import { Button, ButtonGroup, debounce } from "@mui/material";
import FilterInput from "../FilterInput";
import NoteButton from "../NoteButton";
import "./index.css";
import { Virtuoso } from "react-virtuoso";
import { startTransition } from "react";

// const Virtuoso = ({ totalCount, itemContent, itemHeight }) => {
//   const [, setForceRender] = useState(0);
//   const visibleItems = useRef(new Set());

//   const items = Array.from({ length: totalCount }).map((_, index) => {
//     const isVisible = visibleItems.current.has(index);

//     return (
//       <div
//         className="virtuoso-item"
//         key={index}
//         data-index={index}
//         style={{ height: itemHeight }}
//       >
//         {isVisible ? itemContent(index) : null}
//       </div>
//     );
//   });

//   // Subscribe to all items with IntersectionObserver
//   useEffect(() => {
//     const observer = new IntersectionObserver((entries) => {
//       entries.forEach((entry) => {
//         if (entry.isIntersecting) {
//           visibleItems.current.add(Number(entry.target.dataset.index));
//         } else {
//           visibleItems.current.delete(Number(entry.target.dataset.index));
//         }
//       });

//       setForceRender((prev) => prev + 1);
//     });

//     [...document.querySelectorAll(".virtuoso-item")].forEach((item) => {
//       observer.observe(item);
//       if (item.getBoundingClientRect().top < window.innerHeight) {
//         visibleItems.current.add(Number(item.dataset.index));
//       } else {
//         visibleItems.current.delete(Number(item.dataset.index));
//       }
//     });

//     return () => {
//       observer.disconnect();
//     };
//   }, []);

//   return (
//     <div className="virtuoso-list" style={{ height: itemHeight * totalCount }}>
//       {items}
//     </div>
//   );
// };

function NotesList({
  notes,
  activeNoteId,
  onNoteActivated,
  onNewNotesRequested,
  onDeleteAllRequested,
}) {
  const [filterInput, setFilterInput] = useState("");
  const [filterValue, setFilterValue] = useState("");

  const setFilterValueDebounced = useMemo(() => {
    return debounce(setFilterValue, 300);
  }, []);

  const filteredNotes = Object.values(notes)
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .filter(({ text }) => {
      if (!filterValue) {
        return true;
      }

      return text.toLowerCase().includes(filterValue.toLowerCase());
    });

  return (
    <div className="notes-list" style={{ position: "relative" }}>
      <div className="notes-list__filter">
        <FilterInput
          filter={filterInput}
          onChange={(value) => {
            setFilterInput(value);
            // setFilterValueDebounced(value);
            startTransition(() => {
              setFilterValue(value);
            });
            // requestIdleCallback(() => {
            //   performance.mark("idle callback fired");
            // });
          }}
          noteCount={Object.keys(notes).length}
        />
      </div>

      <div className="notes-list__notes">
        {filteredNotes.map(({ id, text, date }) => (
          <NoteButton
            key={id}
            isActive={activeNoteId === id}
            id={id}
            onNoteActivated={onNoteActivated}
            text={text}
            filterText={filterValue}
            date={date}
          />
        ))}

        {/* <Virtuoso
          totalCount={filteredNotes.length}
          itemContent={(index) => {
            const { id, text, date } = filteredNotes[index];
            return (
              <NoteButton
                key={id}
                isActive={activeNoteId === id}
                id={id}
                onNoteActivated={onNoteActivated}
                text={text}
                filterText={filter}
                date={date}
              />
            );
          }}
          itemHeight={68}
          // style={{ height: "100%" }}
        /> */}
      </div>

      <div className="notes-list__controls">
        <ButtonGroup size="small">
          <Button
            classes={{ root: "notes-list__control" }}
            onClick={() => onNewNotesRequested({ count: 1, paragraphs: 1 })}
          >
            + Note
          </Button>
          <Button
            classes={{ root: "notes-list__control" }}
            onClick={() => onNewNotesRequested({ count: 1, paragraphs: 300 })}
          >
            + Huge
          </Button>
          <Button
            classes={{ root: "notes-list__control" }}
            onClick={() => onNewNotesRequested({ count: 100, paragraphs: 1 })}
          >
            + 100
          </Button>
        </ButtonGroup>
        <ButtonGroup size="small">
          <Button
            classes={{ root: "notes-list__control" }}
            onClick={() => onDeleteAllRequested()}
          >
            Delete all
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
}

export default NotesList;
