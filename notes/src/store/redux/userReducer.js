import { createAction } from "@reduxjs/toolkit";
import { produce } from "immer";

export const updateLastActiveDate = createAction(
  "notes/updateLastActiveDate",
  (dateString) => {
    return {
      payload: {
        dateString,
      },
    };
  }
);

const userReducer = (userData = [], action) => {
  if (action.type === updateLastActiveDate.toString()) {
    return produce(userData, (draft) => {
      draft[0].lastActiveDate = action.payload.dateString;
    });

    // const [currentUser, ...otherUsers] = userData;

    // return [
    //   {
    //     ...currentUser,
    //     lastActiveDate: action.payload.dateString,
    //   },
    //   ...otherUsers,
    // ];
  }

  return userData;
};

export default userReducer;
