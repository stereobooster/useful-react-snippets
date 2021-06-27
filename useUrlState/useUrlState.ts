import { useEffect, useRef, useState, RefObject, useCallback } from "react";
import qs from "qs";
import isEqual from "lodash/isEqual";
import merge from "lodash/merge";
import pick from "lodash/pick";
import omit from "lodash/omit";
import omitBy from "lodash/omitBy";
import { History } from "history";

import { useHistory } from "react-router";
import { useFocus } from "../useFocus/useFocus";
import { getSearchParams } from "../getSearchParams";
import { JSONValue } from "../types";

const newPath = <T extends Record<string, any>>(state: T, initialState: T) =>
  `${window.location.pathname}?${qs.stringify(
    omitBy(
      {
        ...getSearchParams(window.location.search),
        ...state,
      },
      (value, key) => initialState[key] === value
    )
  )}${window.location.hash}`;

const emptyArray = Object.freeze([]) as any;

type UseUrlStateOptions<T extends Record<string, any>> = {
  /**
   * Converts "search object" to correct internal state
   */
  decode: (rawState: Record<string, any>) => Partial<T>;
  /**
   * ref which will be passed to `useFocus`
   */
  focusRef?: RefObject<HTMLElement>;
  /**
   * for atomic values it will use `history.push` and move focus. Example: buttons, selects
   * for other values it will use `history.replace` and will not move focus. Example: text input
   */
  nonAtomic?: Array<keyof T> | ReadonlyArray<keyof T>;
  key?: string;
};

type HistoryState<T> =
  | {
      key?: string;
      newState: T;
    }
  | undefined;

export const useUrlState = <T extends Record<string, JSONValue>>(
  initialStateBase: T | (() => T),
  {
    decode,
    focusRef,
    nonAtomic = emptyArray,
    key = window.location.pathname,
  }: UseUrlStateOptions<T>
) => {
  const history: History<HistoryState<T>> = useHistory();

  // memoization
  const [initialState] = useState(initialStateBase);

  const [state, setState] = useState(
    () =>
      merge(
        { ...initialState },
        decode(getSearchParams(window.location.search))
      ) as T
  );

  const focus = useFocus(focusRef);
  const previousStateRef = useRef(state);

  useEffect(
    () =>
      history.listen((location) => {
        let newState: T;
        const locationState = location.state;
        if (
          locationState &&
          typeof locationState === "object" &&
          locationState.key
        ) {
          if (locationState.key === key) {
            newState = locationState.newState;
          } else {
            // event from different hook - ignore
            return;
          }
        }

        // @ts-ignore
        if (newState === undefined) {
          newState = {
            ...initialState,
            ...decode(getSearchParams(location.search)),
          };
        }

        // states are the same - ignore
        if (isEqual(previousStateRef.current, newState)) return;

        const justAtomic = isEqual(
          pick(previousStateRef.current, nonAtomic),
          pick(newState, nonAtomic)
        );
        if (justAtomic) focus();

        // update state
        previousStateRef.current = newState;
        setState(newState);
      }),
    [key, initialState, history, decode, previousStateRef, focus, nonAtomic]
  );

  const setStateWithHistory = useCallback(
    (newState: T) => {
      if (isEqual(previousStateRef.current, newState)) return;

      // any atomic field changed
      const anyAtomic = !isEqual(
        omit(previousStateRef.current, nonAtomic),
        omit(newState, nonAtomic)
      );

      if (anyAtomic) {
        history.push(newPath(newState, initialState), {
          key,
          newState,
        });
      } else {
        history.replace(newPath(newState, initialState), {
          key,
          newState,
        });
      }

      previousStateRef.current = newState;
      setState(newState);
    },
    [key, initialState, history, nonAtomic, previousStateRef]
  );

  const setStateWithCallback = useCallback(
    (newState: T | ((x: T) => T)) => {
      if (newState instanceof Function) {
        newState = newState(previousStateRef.current);
      }
      setStateWithHistory(newState);
    },
    [setStateWithHistory, previousStateRef]
  );

  return [state, setStateWithCallback] as const;
};
