import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import Brightness2Icon from "@mui/icons-material/Brightness2";
import { useContext, memo } from "react";
import { DarkModeContext } from "../DarkModeContext";
import "./index.css";
import { useContextSelector } from "use-context-selector";

function DarkModeSwitcher() {
  // const { mode, setMode } = useContext(DarkModeContext);
  // every time the context updates, useContextSelector will check
  // if any of the fields you subscribe to (mode or setMode) are actually changed.
  // and ONLY if any of those fields have changed - it would re-render components
  // that are subscribed to those values (DarkModeSwitcher in our case.
  const mode = useContextSelector(DarkModeContext, (value) => value.mode);
  const setMode = useContextSelector(DarkModeContext, (value) => value.setMode);

  return (
    <div className="theme-switcher">
      <ToggleButtonGroup
        size="small"
        value={mode}
        exclusive
        onChange={(_e, value) => setMode(value)}
        aria-label="text alignment"
      >
        <ToggleButton value="light">
          <WbSunnyIcon />
        </ToggleButton>
        <ToggleButton value="dark">
          <Brightness2Icon />
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
}

export default memo(DarkModeSwitcher);
