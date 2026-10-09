import type { FabGuideStepId } from "./messages";

/** Selectors for controls that already exist on the active Flesh and Blood layout. */
export function fabGuideTargetSelector(step: FabGuideStepId, mobile: boolean): string {
  switch (step) {
    case "cards":
      return '[data-testid="fab-hand-bottom"]';
    case "attack":
      return mobile
        ? '[data-testid="fab-player-hero-row"] [data-slot="weapon"]'
        : '[data-testid="fab-player-bottom"] [data-zone-id$=":weapon1"]';
    case "defend":
      return mobile
        ? '[data-testid="fab-player-hero-row"] [data-slot="chest"]'
        : '[data-testid="fab-player-bottom"] [data-zone-id$=":chest"]';
    case "pitch":
      return mobile
        ? '[data-testid="fab-player-zone-inventory"] [data-zone="pitch"]'
        : '[data-testid="fab-player-bottom"] [data-zone="pitch"]';
    case "settings":
      return mobile ? '[aria-label="Open match menu"]' : '[aria-label="Open your player actions"]';
    case "report":
      return mobile ? '[data-testid="fab-opponent-rail"]' : '[aria-label="Opponent match status"]';
    case "priority":
      return mobile ? '[aria-label="Open match menu"]' : '[aria-label="Hold next priority window"]';
    case "bug":
      return mobile ? '[aria-label="Open match menu"]' : '[aria-label="Open your player actions"]';
    case "correction":
      return '[data-testid="fab-hand-bottom"]';
    case "undo":
      return mobile ? '[aria-label="Open match menu"]' : '[data-testid="fab-action-undo"]';
    default: {
      const unreachable: never = step;
      return unreachable;
    }
  }
}
