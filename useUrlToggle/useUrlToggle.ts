import { useEffect, useRef, useState, useCallback } from "react";
import { useHistory } from "react-router";
import qs from "qs";
import omitBy from "lodash/omitBy";

const getSearchParams = (search: string) =>
  qs.parse(search.replace("?", "")) || {};

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
  const history = useHistory();

  // memoization
  const [initialUrlValue] = useState(() =>
    decode(getSearchParams(window.location.search)[name], initialValue)
  );

  const preconditionRef = useRef(precondition);
  preconditionRef.current = precondition;

  const [state, setState] = useState(
    preconditionRef.current === false ? initialValue : initialUrlValue
  );
  const currentStateRef = useRef(state);
  const navigatedWithHook = useRef(false);

  useEffect(
    () => {
      if (
        preconditionRef.current === false &&
        initialUrlValue !== initialValue
      ) {
        history.replace(newPath(name, initialValue, initialValue), {});
      }
    },
    // we only want to execute this hook once for initial load
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(
    () =>
      history.listen(() => {
        const current = decode(
          getSearchParams(window.location.search)[name],
          initialValue
        );
        if (
          preconditionRef.current === false &&
          currentStateRef.current !== current
        ) {
          history.goBack();
          return;
        }
        currentStateRef.current = current;
        setState(current);
      }),
    [name, preconditionRef, initialValue, history]
  );

  const setStateWithHistory = useCallback(
    (newValue: boolean) => {
      if (preconditionRef.current === false && newValue !== initialValue)
        return;

      const oldValue = currentStateRef.current;
      if (oldValue !== newValue) {
        if (newValue === initialValue && navigatedWithHook.current) {
          history.goBack();
        } else {
          history.push(newPath(name, initialValue, newValue), {});
        }
        navigatedWithHook.current = true;
        currentStateRef.current = newValue;
        setState(newValue);
      }
    },
    [name, preconditionRef, initialValue, history, currentStateRef]
  );

  return [state, setStateWithHistory] as const;
};
