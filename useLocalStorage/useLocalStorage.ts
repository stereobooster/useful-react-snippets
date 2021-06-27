import { useCallback, useEffect, useRef, useState } from 'react'
import { JSONValue } from '../types'

export function useLocalStorage<T extends JSONValue>(
  key: string,
  initialValue: T | (() => T)
) {
  const [value, setValue] = useState<T>(() => {
    const valueToStore =
      initialValue instanceof Function ? initialValue() : initialValue
    try {
      const storedValue = window.localStorage.getItem(key)
      return storedValue ? JSON.parse(storedValue) : valueToStore
    } catch (error) {
      /* eslint-disable no-console */
      console.log(error)
      return valueToStore
    }
  })

  const currentValue = useRef(value)
  currentValue.current = value

  const setValueWithStore = useCallback(
    (newValue: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          newValue instanceof Function
            ? newValue(currentValue.current)
            : newValue
        setValue(valueToStore)
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      } catch (error) {
        /* eslint-disable no-console */
        console.log(error)
      }
    },
    [key, currentValue, setValue]
  )

  useEffect(() => {
    const eventHandler = (event: StorageEvent) => {
      if (event.key !== key) return
      try {
        event.newValue && setValue(JSON.parse(event.newValue))
      } catch (error) {
        /* eslint-disable no-console */
        console.log(error)
      }
    }
    window.addEventListener('storage', eventHandler)
    return () => window.removeEventListener('storage', eventHandler)
  }, [key, setValue])

  return [value, setValueWithStore] as const
}
