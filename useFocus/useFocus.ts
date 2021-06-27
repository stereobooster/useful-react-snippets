import { RefObject, useCallback, useLayoutEffect, useState } from 'react'

export const focusAny = (el: HTMLElement | null | undefined) => {
  if (!el) return
  const prev = el.tabIndex
  el.tabIndex = 0
  el.focus()
  el.tabIndex = prev
}

// will focus element or main landmark inside
export const useFocus = (mainRef?: RefObject<HTMLElement>) => {
  const [counter, setCounter] = useState(0)
  useLayoutEffect(() => {
    if (counter === 0 || !mainRef) return
    // temporary solution
    document.querySelector('main')?.parentElement?.scrollTo(0, 0)
    // mainRef.current?.scrollTo(0, 0)
    focusAny(mainRef.current?.querySelector('main') || mainRef.current)
  }, [mainRef, counter])

  return useCallback(() => {
    if (!mainRef) return
    setCounter((current) => current + 1)
  }, [mainRef, setCounter])
}
