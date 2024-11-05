import { Button, ButtonGroup, debounce } from "@mui/material";
import FilterInput from "../FilterInput";
import NoteButton from "../NoteButton";
import "./index.css";
import { Virtuoso } from 'react-virtuoso'
import { useState, useEffect, useRef, useMemo, startTransition } from "react";

// our own implementation of Virtuoso
// it uses Intersection Observer API;
// const OwnVirtuoso = ({ totalCount, itemContent, itemHeight }) => {
//   const [, setForceRender] = useState(0);
//   const visibleItems = useRef(new Set());

//   const items = Array.from({ length: totalCount }).map((_, index) => {
//     const isVisible = visibleItems.current.has(index);
//     return (
//       <div className="own-virtuoso-item" key={index} data-index={index} style ={{ height: itemHeight, overflow: "hidden" }}>
//         {isVisible ? itemContent(index) : null}
//       </div>
//     );
//   })

//   // Subscribe for all items with IntersectionObserver
//   useEffect(() => {
//     // create observer
//     const observer = new IntersectionObserver((entries) => {
//       console.log("IN OBSERVER");
//       entries.forEach((entry) => {
//         if (entry.isIntersecting) {
//           visibleItems.current.add(Number(entry.target.dataset.index))
//         } else {
//           visibleItems.current.delete(Number(entry.target.dataset.index))
//         }
//       })

//       setForceRender((prev) => prev + 1);
//     })

//     // take all items in the list
//     const allNotes = document.querySelectorAll('.own-virtuoso-item');

//     // subscribe for every item/ observe every item
//     allNotes.forEach((item) => {
//       observer.observe(item);
//       // check if the item within the screen
//       if(item.getBoundingClientRect().top > window.innerHeight) {
//         visibleItems.current.add(Number(item.dataset.index));
//       } else {
//         visibleItems.current.delete(Number(item.dataset.index));
//       }
//     });
    
//     // unsubscribe
//     return () => {
//       observer.disconnect();
//     }
//   }, [])

//   // 1 - add a height of all items to the wrapper
//   return <div className="own-virtuoso-list" style ={{ height: itemHeight * totalCount }}>{items}</div>
// };

function NotesList({
  notes,
  activeNoteId,
  onNoteActivated,
  onNewNotesRequested,
  onDeleteAllRequested,
}) {
  // const [filter, setFilter] = useState("");

  const [filterInput, setFilterInput] = useState("");
  const [filterValue, setFilterValue] = useState("");

  // it's going to update the list when I'm finish typing + 300ms
  // const setFilterValueDebounced = useMemo(() => debounce(setFilterValue, 300), []);

  const filteredNotes = Object.values(notes)
  .sort((a, b) => b.date.getTime() - a.date.getTime())
  .filter(({ text }) => {
    if (!filterValue) {
      return true;
    };
    return text.toLowerCase().includes(filterValue.toLowerCase());
  });

  return (
    <div className="notes-list" style={{ position: "relative" }}>
      <div className="notes-list__filter">
        <FilterInput
          filter={filterInput}
          onChange={(value) => {
            setFilterInput(value);
            // startTransition doesn't have any delays or timeouts, it just marks the interaction
            // inside it as not urgent and it can be delayed and run concurrently in the background
            startTransition(() => {
              setFilterValue(value);
            })
          }}
          noteCount={Object.keys(notes).length}
        />
      </div>

      <div className="notes-list__notes">
        {/* approach without Virtuoso  */}
        {filteredNotes
          .map(({ id, text, date }) => (
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

          {/* approach with Virtuoso */}
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
              )
            }}
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
