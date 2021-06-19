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
 * @param blocked - prevents change of the state, for example,
 *  if there are no selected items we can't show delete modal.
 *  As well it will block forward button and replace flag on the first load - for concistency
 */
export const useUrlToggle = (
  name: string,
  initialValue: boolean,
  blocked?: boolean
) => {
  const history = useHistory();

  // memoization
  const [initialUrlValue] = useState(() =>
    decode(getSearchParams(window.location.search)[name], initialValue)
  );

  const blockedRef = useRef(blocked);
  blockedRef.current = blocked;

  const [state, setState] = useState(
    blockedRef.current === false ? initialValue : initialUrlValue
  );
  const currentStateRef = useRef(state);
  const navigatedWithHook = useRef(false);

  useEffect(
    () => {
      if (blockedRef.current === false && initialUrlValue !== initialValue) {
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
          blockedRef.current === false &&
          currentStateRef.current !== current
        ) {
          history.goBack();
          return;
        }
        currentStateRef.current = current;
        setState(current);
      }),
    [name, blockedRef, initialValue, history]
  );

  const setStateWithHistory = useCallback(
    (newValue: boolean) => {
      if (blockedRef.current === false) return;

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
    [name, blockedRef, initialValue, history, currentStateRef]
  );

  return [state, setStateWithHistory] as const;
};
