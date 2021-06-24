import styled from "styled-components";
import { focusRing } from "../focusRing";

/**
 * Don't forget to provide styles for:
 *
 * - default state
 * - `:disabled`
 * - `:focus-visible`
 * - `:read-only`
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

  // https://stackoverflow.com/questions/18856246/input-type-search-hide-the-icons
  ::-webkit-search-decoration,
  ::-webkit-search-cancel-button,
  ::-webkit-search-results-button,
  ::-webkit-search-results-decoration {
    display: none;
  }

  // https://stackoverflow.com/questions/17000562/removing-clear-and-reveal-password-icons-from-ie10
  ::-ms-clear,
  ::-ms-reveal {
    display: none;
  }

  // https://stackoverflow.com/questions/3790935/can-i-hide-the-html5-number-input-s-spin-box
  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  -moz-appearance: textfield;

  // https://stackoverflow.com/questions/2918707/turn-off-iphone-safari-input-element-rounding
  appearance: none;
  border-radius: 0;
`;
