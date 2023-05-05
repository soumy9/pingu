"use client";

import { createContext, Dispatch, ReactNode, useReducer } from "react";

type Actions = "set-request-count" | "decrement-request-count" | "increment-request-count";

type StateType = {
  requestCount: number;
};

type ActionType = {
  type: Actions;
  requestCount?: number;
};

const initialState: StateType = {
  requestCount: 0,
};

const reducer = (state: StateType, action: ActionType): StateType => {
  switch (action.type) {
    case "set-request-count": {
      return {
        ...state,
        requestCount: 0,
      };
    }
    case "decrement-request-count": {
      const newRequestCount = state.requestCount - 1;
      return {
        ...state,
        requestCount: newRequestCount,
      };
    }
		case "increment-request-count": {
      const newRequestCount = state.requestCount + 1;
      return {
        ...state,
        requestCount: newRequestCount,
      };
    }
  }
};

export const FriendRequestContext = createContext<{
  state: StateType;
  dispatch: Dispatch<ActionType>;
}>({
  state: initialState,
  dispatch: () => null,
});

export const FriendRequestProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

	return <FriendRequestContext.Provider value={{state, dispatch}}>
		{children}
	</FriendRequestContext.Provider>
};
