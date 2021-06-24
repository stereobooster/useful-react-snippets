export const focusRing = (color: string = "blue", inset?: boolean) => ({
  // Remove excess padding and border in Firefox 4+
  "::-moz-focus-inner": {
    border: 0,
    padding: 0,
  },
  ":focus": {
    outline: "none",
    // Use `box-shadow` until browsers don't support `border-radius` for `outline`
    // https://css-tricks.com/platform-news-rounded-outlines-gpu-accelerated-svg-animations-how-css-variables-are-resolved/#rounded-outlines-are-coming-to-firefox
    "box-shadow": inset
      ? `inset 0 0 0 3px ${color}`
      : `0 0 0 2px #fff, 0 0 0 5px ${color}`,
  },
  // Safari and Internet Explorer need polyfill for `:focus-visible`
  // https://caniuse.com/css-focus-visible, using workaround instead
  ":focus:not(:focus-visible)": { "box-shadow": "none" },
  transition: `box-shadow 100ms ease-in-out`,
});
