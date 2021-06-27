import { useEffect, useRef, useState, useCallback } from "react";
import qs from "qs";
import omitBy from "lodash/omitBy";
import { useHistory } from "react-router";
import { History } from "history";
import { getSearchParams } from "../getSearchParams";

const decode = (urlValue: any, initialValue: boolean) => {
  if (urlValue === undefined) return initialValue;
  return urlValue === "true";
};

const newPath = (name: string, initialValue: boolean, newValue: boolean) =>
  `${window.location.pathname}?${qs.stringify(
    omitBy(
      {
        ...getSearchParams(window.location.search),
        [name]: newValue,
      },
      (value, key) => key === name && initialValue === value
    )
  )}${window.location.hash}`;

type HistoryState =
  | {
      key?: string;
      newValue: boolean;
    }
  | undefined;

/**
 * Hook similar to `useState`, but mirrors value in the URL.
 * Creates at most one history entry - we don't want to polute users history.
 *
 * @param name - flag in the URL
 * @param initialValue - the same as in `useState(initialValue)`
 * @param precondition - prevents change of the state, for example,
 *  if there are no selected items we can't show delete dialog.
 *  As well it will block forward button and replace flag on the first load - for concistency
 */
export const useUrlToggle = (
  name: string,
  initialValue: boolean,
  precondition?: boolean
) => {
  const history: History<HistoryState> = useHistory();

  // memoization
  const [initialUrlValue] = useState(() =>
    decode(getSearchParams(window.location.search)[name], initialValue)
  );

  const preconditionRef = useRef(precondition);
  preconditionRef.current = precondition;

  const [state, setState] = useState(
    preconditionRef.current === false ? initialValue : initialUrlValue
  );
  useEffect(
    () => {
      const newValue = initialUrlValue;
      if (preconditionRef.current === false && newValue !== initialValue) {
        history.replace(newPath(name, initialValue, initialValue), {
          key: name,
          newValue: initialValue,
        });
      }
    },
    // we only want to execute this hook once for initial load
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const currentStateRef = useRef(state);

  useEffect(
    () =>
      history.listen((location) => {
        let newValue: boolean;
        const locationState = location.state;
        if (
          locationState &&
          typeof locationState === "object" &&
          locationState.key
        ) {
          if (locationState.key === name) {
            newValue = locationState.newValue;
          }
        }
        // @ts-ignore
        if (newValue === undefined) {
          newValue = decode(
            getSearchParams(window.location.search)[name],
            initialValue
          );
        }

        if (preconditionRef.current === false && newValue !== initialValue) {
          history.goBack();
          return;
        }

        currentStateRef.current = newValue;
        setState(newValue);
      }),
    [name, preconditionRef, initialValue, history]
  );

  const navigatedWithHook = useRef(false);
  const setStateWithHistory = useCallback(
    (newValue: boolean) => {
      if (preconditionRef.current === false && newValue !== initialValue)
        return;
      if (currentStateRef.current === newValue) return;

      if (newValue === initialValue && navigatedWithHook.current) {
        history.goBack();
      } else {
        navigatedWithHook.current = true;
        history.push(newPath(name, initialValue, newValue), {
          key: name,
          newValue,
        });
      }
      currentStateRef.current = newValue;
      setState(newValue);
    },
    [name, preconditionRef, initialValue, history, currentStateRef]
  );

  return [state, setStateWithHistory] as const;
};
