import { TextField } from "@mui/material";
import { memo } from 'react';

function FilterInput({ filter, onChange, noteCount }) {
  return (
    <TextField
      className="notes-list__input"
      type="search"
      size="small"
      value={filter}
      onChange={(e) => onChange(e.target.value)}
      placeholder={`Filter ${noteCount} note${noteCount === 1 ? "" : "s"}`}
    />
  );
}

// memo will preserve FilterInput component from rendering
// if prev props and current props are equal
export default memo(FilterInput);
