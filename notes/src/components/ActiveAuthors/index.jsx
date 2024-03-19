import { Avatar, AvatarGroup } from "@mui/material";
import { useSelector } from "react-redux";
import avatar1 from "./avatar1.jpg";
import avatar2 from "./avatar2.jpg";
import avatar3 from "./avatar3.jpg";
import { memo } from "react";
import { memoize } from "proxy-memoize";

function activeThisMonthSelector(state) {
  return state.users.filter(
    (i) =>
      new Date(i.lastActiveDate).getFullYear() === 2024 &&
      new Date(i.lastActiveDate).getMonth() === 2
  );
}

const activeThisMonthNamesSelector = memoize((state) =>
  activeThisMonthSelector(state).map((i) => <span key={i.name}>{i.name}</span>)
);
// 1) track every value we accessed
// 2) every time we use the dot, it eraces the previus (the higher-level) value
//    and replaces it with the exact fields we accessed
// ~~state~~
// ~~state.users~~
// ~~state.users[0], state.users[1], state.users[2]~~
// state.users[0].lastActiveDate, state.users[1].lastActiveDate, state.users[2].lastActiveDate
// ~~filtered users[0], filtered users[1], filtered users[2]~~
// filtered users[0].name, filtered users[1].name, filtered users[2].name

function ActiveAuthors() {
  // const activeThisMonthNumber = useSelector(
  //   (state) => activeThisMonthSelector(state).length
  // );
  // THIS needs to be memoized:

  const activeThisMonth = useSelector(
    (state) =>
      state.users.filter(
        (i) =>
          new Date(i.lastActiveDate).getFullYear() === 2024 &&
          new Date(i.lastActiveDate).getMonth() === 2
      ),
    // are a bad idea (only use them as a last resort):
    (prev, next) => {
      console.log(
        "comparison running",
        prev === next,
        JSON.stringify(prev) === JSON.stringify(next)
      );
      return (
        JSON.stringify(prev) === JSON.stringify(next) // or shallowEqual, or deepEqual
      );
    } // or shallowEqual, or deepEqual
    // ~20ms → in total
  );

  // 1) rule of thumb: try to return the primitive value whenever possible
  // const activeThisMonthNumber = useSelector(
  //   (state) => activeThisMonthSelector(state).length
  // );
  // const activeThisMonthNames = useSelector((state) =>
  //   activeThisMonthSelector(state)
  //     .map((i) => i.name)
  //     .join(", ")
  // );
  // 2) proxy-memoize
  // const activeThisMonthNames = useSelector(activeThisMonthNamesSelector);
  // 3) reselect
  // 4) immer
  // 5) custom comparison function
  // refactor the state
  // {} !== {}, '' === ''

  return (
    <div className="primary-pane__authors">
      <div className="primary-pane__authors-last-active">
        {activeThisMonth.length} users active this month:{" "}
        {activeThisMonth.map((i) => i.name).join(", ")}
      </div>
      <AvatarGroup max={2}>
        <Avatar src={avatar1} />
        <Avatar src={avatar2} />
        <Avatar src={avatar3} />
      </AvatarGroup>
    </div>
  );
}

export default memo(ActiveAuthors);
