import { createContext, useEffect, useMemo, useState } from "react";
import "./index.css";

export const DarkModeContext = createContext();

export function DarkModeProvider({ children }) {
  const [mode, setMode] = useState("light");

  useEffect(() => {
    document.body.classList.add("theme-" + mode);

    return () => {
      document.body.classList.remove("theme-" + mode);
    };
  }, [mode]);

  const value = useMemo(() => ({ mode, setMode }), [mode]);

  return (
    <DarkModeContext.Provider value={value}>
      {children}
    </DarkModeContext.Provider>
  );
}
