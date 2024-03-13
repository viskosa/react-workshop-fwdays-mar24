import { useEffect, useMemo, useState } from "react";
import { createContext } from "use-context-selector";
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

  const sunAngleToHorizon = Math.random() * 90;
  // console.log("DarkModeProvider passes down the value:", value);

  return (
    <DarkModeContext.Provider value={{ mode, sunAngleToHorizon, setMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}
