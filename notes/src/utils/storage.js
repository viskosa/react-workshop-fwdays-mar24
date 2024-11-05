import { formatISO, parseISO } from "date-fns";
import { parse } from "marked";

let notes;

const loadNotesFromLocalStorage = () => {
  const parsedNotes = JSON.parse(localStorage.reactWorkshopAppNotes || "{}");

  const transformedNotes = {};
  for (const [id, note] of Object.entries(parsedNotes)) {
    const transformedNote = { ...note, date: parseISO(note.date) };
    transformedNotes[id] = transformedNote;
  }

  return transformedNotes;
};

const saveNotesToLocalStorage = async (notes) => {
  const transformedNotes = {};
  // 1 - setup timer that measures how long my loop has been running for
  let startTime = performance.now();

  for (const [id, note] of Object.entries(notes)) {
    const transformedNote = {
      ...note,
      date: formatISO(note.date),
      html: parse(note.text, { headerIds: false, mangle: false }),
    };
    transformedNotes[id] = transformedNote;

    // 2 - after every iteration we're going to check wether we've exceeded 5ms budget
    if (performance.now() - startTime > 5) {
      await yieldToMainThread();
      startTime = performance.now();
    }

    // 2 - we can do this step better - 
    // for chrome browser we have special API that tells us that user tries to do some input.
    // so if browser is waiting for the time when it can process user input,
    // we will yield it to main thread and give it possibility to process user input
    // if (navigator.scheduling.isInputPending()) {
    //   await yieldToMainThread();
    //   // we also have another experimental API for chrome:
    //   // await scheduler.yield({ proprity: 'background'});
    //   startTime = performance.now();
    // }
  }

  const stringifiedNotes = JSON.stringify(transformedNotes);
  localStorage.reactWorkshopAppNotes = stringifiedNotes;
};

// 3 - it returns a Promise, that resolves in 0 ms
// it calls setTimeout, and setTimeout resolves in the next frame
// and by doing this we give the browser possibility to handle any inputs that in the queue
// and process that input before we go to the next loop
const yieldToMainThread = () => {
  return new Promise((resolve) => {
    setTimeout(resolve, 0)
  })
}

//-------caching-----------------------------------------
const parseCache = new Map(); // should map original note.text to parsed note.text
// every time we pass text to the parse function we will check wether it is already parsed
// and if yes - will skip parsing

function parseCached(text, options) {
  if (parseCache.has(text)) {
    return parseCache.get(text);
  }

  const html = parse(text, options);
  parseCache.set(text, html);

  // we should invalidate cache because it can grow too big
  // Oldest cache eviction (вигнання) policy
  if (parseCache.size > 1000) {
    parseCache.delete(parseCache.keys().next().value) // remove the oldest key
  };

  return html;
}

const saveNotesToLocalStorageWithCaching = async (notes) => {
  const transformedNotes = {};

  for (const [id, note] of Object.entries(notes)) {
    const transformedNote = {
      ...note,
      date: formatISO(note.date),
      html: parseCached(note.text, { headerIds: false, mangle: false }),
    };
    transformedNotes[id] = transformedNote;
  }

  const stringifiedNotes = JSON.stringify(transformedNotes);
  localStorage.reactWorkshopAppNotes = stringifiedNotes;
};
//-------------------------------------------------

export const getNotes = () => {
  if (!notes) {
    notes = loadNotesFromLocalStorage();
  }

  return notes;
};

export const putNote = (noteId, { text, date }) => {
  if (notes[noteId]) {
    // The note already exists; just update it
    notes = {
      ...notes,
      [noteId]: {
        ...notes[noteId],
        text: text ?? notes[noteId].text,
        date: date ?? notes[noteId].date,
      },
    };
  } else {
    // The note doesn’t exist; create it, filling the creation date
    notes = {
      ...notes,
      [noteId]: {
        id: noteId,
        text: text,
        date: date ?? new Date(),
      },
    };
  }

  // saveNotesToLocalStorage(notes);
  saveNotesToLocalStorageWithCaching(notes);
};

export const deleteNotes = () => {
  notes = {};

  // saveNotesToLocalStorage(notes);
  saveNotesToLocalStorageWithCaching(notes);
};
