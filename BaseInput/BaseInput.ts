import styled from "styled-components";

export const focusRing = (color: string = "blue", inset?: boolean) => ({
  /* Remove excess padding and border in Firefox 4+ */
  "::-moz-focus-inner": {
    border: 0,
    padding: 0,
  },
  ":focus": {
    outline: "none",
  },
  ":focus-visible": {
    // https://css-tricks.com/platform-news-rounded-outlines-gpu-accelerated-svg-animations-how-css-variables-are-resolved/#rounded-outlines-are-coming-to-firefox
    "box-shadow": inset
      ? `inset 0 0 0 3px ${color}`
      : `0 0 0 2px #fff, 0 0 0 5px ${color}`,
  },
  transition: `box-shadow 100ms ease-in-out`,
});

/**
 * Don't forget to provide styles for:
 *
 * - default state
 * - `:disabled`
 * - `:focus-visible`
 *
 * And maybe
 *
 * - `:invalid`
 * - `:valid`
 * = `:required`
 * - `::placeholder`
 */
export const BaseInput = styled.input`
  ${focusRing()}

  /* https://stackoverflow.com/questions/18856246/input-type-search-hide-the-icons */
  ::-webkit-search-decoration,
  ::-webkit-search-cancel-button,
  ::-webkit-search-results-button,
  ::-webkit-search-results-decoration {
    display: none;
  }

  /* https://stackoverflow.com/questions/17000562/removing-clear-and-reveal-password-icons-from-ie10 */
  ::-ms-clear,
  ::-ms-reveal {
    display: none;
  }

  /* https://stackoverflow.com/questions/3790935/can-i-hide-the-html5-number-input-s-spin-box */
  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  -moz-appearance: textfield;

  /* https://stackoverflow.com/questions/2918707/turn-off-iphone-safari-input-element-rounding */
  appearance: none;
  border-radius: 0;
`;
