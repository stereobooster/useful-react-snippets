import { useCallback, useEffect, useRef, useState } from "react";
import { JSONValue } from "../types";

// https://github.com/Microsoft/TypeScript/issues/1897#issuecomment-822032151
type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

type Serializer<S> = {
  parse: (x: string) => S;
  stringify: (x: S) => string;
};

/**
 * Use the same way as you would use `useState`:
 *
 * ```ts
 * const [state, setState] = useState(false)
 * ```
 *
 * chnage to:
 *
 * ```ts
 * const [state, setState] = useState('toggle', false)
 * ```
 *
 * By default `useLocalStorage` uses JSON as serializer. You can use alternative serilizer, for example:
 *
 * ```ts
 * import ArsonBase from 'arson'
 *
 * type ARSONValue =
 *  | string
 *  | number
 *  | boolean
 *  | null
 *  | RegExp
 *  | Date
 *  | Buffer
 *  | Map<ARSONValue, ARSONValue>
 *  | Set<ARSONValue>
 *  | ARSONValue[]
 *  | { [key: string]: ARSONValue }
 *
 * const Arson = ArsonBase as Serializer<ARSONValue>
 *
 * const [state, setState] = useLocalStorage('state', x, Arson)
 *
 */
export function useLocalStorage<T extends S, S = JSONValue>(
  key: string,
  initialValue: T | (() => T),
  serializer: Serializer<S> = JSON
) {
  const [value, setValue] = useState<T>(() => {
    const valueToStore =
      initialValue instanceof Function ? initialValue() : initialValue;
    try {
      const storedValue = window.localStorage.getItem(key);
      return storedValue ? (serializer.parse(storedValue) as T) : valueToStore;
    } catch (error) {
      /* eslint-disable no-console */
      console.log(error);
      return valueToStore;
    }
  });

  const currentValue = useRef(value);
  currentValue.current = value;

  const setValueWithStore = useCallback(
    (newValue: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          newValue instanceof Function
            ? newValue(currentValue.current)
            : newValue;
        setValue(valueToStore);
        window.localStorage.setItem(key, serializer.stringify(valueToStore));
      } catch (error) {
        /* eslint-disable no-console */
        console.log(error);
      }
    },
    [key, currentValue, setValue, serializer]
  );

  useEffect(() => {
    const eventHandler = (event: StorageEvent) => {
      if (event.key !== key) return;
      try {
        event.newValue && setValue(serializer.parse(event.newValue) as T);
      } catch (error) {
        /* eslint-disable no-console */
        console.log(error);
      }
    };
    window.addEventListener("storage", eventHandler);
    return () => window.removeEventListener("storage", eventHandler);
  }, [key, setValue, serializer]);

  return [value, setValueWithStore] as const;
}
