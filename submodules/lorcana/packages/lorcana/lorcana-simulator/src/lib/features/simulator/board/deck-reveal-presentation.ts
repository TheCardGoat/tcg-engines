import type { DeckRevealPosition } from "./deck-reveal-dismissal.js";

export function getDeckRevealPresentation(position: DeckRevealPosition): {
  label: string;
  description: string;
  dismissLabel: string;
} {
  const location = position === "top" ? "top" : "bottom";

  return {
    label: `${location[0]!.toUpperCase()}${location.slice(1)} of deck revealed`,
    description: `Review the current ${location} card`,
    dismissLabel: `Dismiss ${location} of deck reveal`,
  };
}
