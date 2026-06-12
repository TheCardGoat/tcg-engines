import type { CardLandStep } from "../types";
import classes from "../ScriptPlayer.module.css";

const LAND_CLASS = classes.landPulse;

interface PlayCardLandOptions {
  step: CardLandStep;
  durationMs: number;
}

/**
 * Subtle "this card was just played" pulse. The just-landed card is
 * tagged with a CSS class that runs a brief scale + glow keyframe; the
 * class is removed when the duration expires. No ghost — the real card
 * is the visual.
 */
export function playCardLand({ step, durationMs }: PlayCardLandOptions): Promise<void> {
  const node = document.querySelector<HTMLElement>(`[data-card-id="${step.cardId}"]`);
  if (!node) return Promise.resolve();
  node.classList.add(LAND_CLASS);
  node.dataset.scriptCardLand = "true";
  return new Promise((resolve) => {
    window.setTimeout(() => {
      node.classList.remove(LAND_CLASS);
      delete node.dataset.scriptCardLand;
      resolve();
    }, durationMs);
  });
}
