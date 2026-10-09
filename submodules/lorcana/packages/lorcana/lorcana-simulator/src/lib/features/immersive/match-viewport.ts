const TEXT_ENTRY_INPUT_TYPES = new Set([
  "button",
  "checkbox",
  "color",
  "file",
  "image",
  "radio",
  "range",
  "reset",
  "submit",
]);

/** Taller than Safari or Chrome toolbars, shorter than an on-screen keyboard. */
const KEYBOARD_INSET_THRESHOLD_PX = 140;

export interface MatchViewportMetrics {
  innerHeight: number;
  visualHeight: number;
  offsetTop: number;
}

export interface MatchViewportFrameStyle {
  height: string;
  transform: string;
}

export function isTextEntryTarget(target: EventTarget | null): boolean {
  if (typeof HTMLElement === "undefined" || !(target instanceof HTMLElement)) {
    return false;
  }

  if (target.isContentEditable) {
    return true;
  }

  const tag = target.tagName;
  if (tag === "TEXTAREA" || tag === "SELECT") {
    return true;
  }

  if (tag !== "INPUT") {
    return false;
  }

  const type = (target as HTMLInputElement).type.toLowerCase();
  return !TEXT_ENTRY_INPUT_TYPES.has(type);
}

export function shouldBlockMatchPageScroll(event: {
  key: string;
  code?: string;
  altKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  target: EventTarget | null;
}): boolean {
  const isSpace = event.key === " " || event.key === "Spacebar" || event.code === "Space";
  if (!isSpace || event.altKey || event.ctrlKey || event.metaKey) {
    return false;
  }

  return !isTextEntryTarget(event.target);
}

/**
 * Size the match to the visible viewport while the on-screen keyboard is open.
 * iOS pans the visual viewport instead of shrinking layout height, which is what
 * shoves the undo control and cuts the board in half.
 */
export function matchViewportFrameStyle(metrics: MatchViewportMetrics): MatchViewportFrameStyle {
  const keyboardInset = Math.max(0, Math.round(metrics.innerHeight - metrics.visualHeight));
  if (keyboardInset <= KEYBOARD_INSET_THRESHOLD_PX) {
    return { height: "", transform: "" };
  }

  const offsetTop = Math.max(0, Math.round(metrics.offsetTop));
  return {
    height: `${Math.max(0, Math.round(metrics.visualHeight))}px`,
    transform: offsetTop > 0 ? `translateY(${offsetTop}px)` : "",
  };
}
