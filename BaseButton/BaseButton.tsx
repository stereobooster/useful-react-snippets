import styled from "styled-components";
import { focusRing } from "../focusRing";

if (typeof document !== "undefined") {
  // https://alxgbsn.co.uk/2011/10/17/enable-css-active-pseudo-styles-in-mobile-safari/
  document.addEventListener("touchstart", function () {}, false);
}

/**
 * reset built-in styles of a button https://css-tricks.com/overriding-default-button-styles/
 *
 * Don't forget to provide styles for:
 *
 * - default state
 * - `:hover`
 * - `:active` (See also https://bugzilla.mozilla.org/show_bug.cgi?id=68851)
 * - `:disabled`
 * - `:focus-visible`
 *
 */
export const BaseButton = styled.button`
  ${focusRing()}

  display: inline-block;
  border: none;
  margin: 0;
  padding: 0;
  width: auto;
  overflow: visible;

  background: transparent;

  // inherit font & color from ancestor
  color: inherit;
  font: inherit;
  text-align: inherit;
  text-transform: inherit;

  // Corrects font smoothing for webkit
  -webkit-font-smoothing: inherit;
  -moz-osx-font-smoothing: inherit;

  cursor: pointer;
  :disabled {
    cursor: default;
  }

  // Corrects inability to style clickable input types in iOS
  -webkit-appearance: none;

  user-select: none;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
`;

BaseButton.defaultProps = {
  type: "button",
  // @ts-ignore https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attr-autocomplete
  autocomplete: "off",
};
