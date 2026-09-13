import { useEffect } from "react";

const INTERACTIVE_TARGETS = [
  "a[href]",
  "button",
  "input",
  "select",
  "summary",
  "textarea",
  "[contenteditable]:not([contenteditable='false'])",
  "[role='button']",
  "[role='combobox']",
  "[role='menuitem']",
  "[role='option']",
  "[role='slider']",
  "[role='spinbutton']",
  "[role='switch']",
  "[role='tab']",
  "[role='textbox']",
  "[role='treeitem']",
].join(",");

function isInteractiveTarget(target: EventTarget | null): boolean {
  return target instanceof Element && target.closest(INTERACTIVE_TARGETS) !== null;
}

/**
 * Binds Space to the currently offered pass move without stealing the key from
 * chat, form fields, native controls, or board interactions that already
 * handled it (for example keyboard dragging a card).
 */
export function usePassHotkey(enabled: boolean, onPass: () => void): void {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code !== "Space" && event.key !== " ") return;
      if (event.repeat || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.defaultPrevented || isInteractiveTarget(event.target)) return;

      event.preventDefault();
      onPass();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, onPass]);
}
