import styled from "styled-components";

if (typeof document !== "undefined") {
  // https://alxgbsn.co.uk/2011/10/17/enable-css-active-pseudo-styles-in-mobile-safari/
  document.addEventListener("touchstart", function () {}, false);
}

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
    "box-shadow": inset
      ? `inset 0 0 0 3px ${color}`
      : `0 0 0 2px #fff, 0 0 0 5px ${color}`,
  },
  transition: `box-shadow 100ms ease-in-out`,
});

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

  /* inherit font & color from ancestor */
  color: inherit;
  font: inherit;
  text-align: inherit;
  text-transform: inherit;

  /* Corrects font smoothing for webkit */
  -webkit-font-smoothing: inherit;
  -moz-osx-font-smoothing: inherit;

  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};

  /* Corrects inability to style clickable input types in iOS */
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
