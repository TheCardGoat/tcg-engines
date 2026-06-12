import type { ResourceFloatStep } from "../types";
import type { Side } from "../../engine";
import classes from "../ScriptPlayer.module.css";

interface PlayResourceFloatOptions {
  step: ResourceFloatStep;
  overlay: HTMLElement;
  durationMs: number;
  sideForPlayerId: (playerId: string) => Side | null;
}

/**
 * Resource floats are non-blocking — they animate alongside whatever card
 * step is running. We resolve the target anchor by data attribute on the
 * appropriate player's resource counter.
 */
export function playResourceFloat({
  step,
  overlay,
  durationMs,
  sideForPlayerId,
}: PlayResourceFloatOptions): Promise<void> {
  const side = sideForPlayerId(step.playerId);
  if (!side) return Promise.resolve();
  const anchor = document.querySelector<HTMLElement>(
    `[data-resource="${step.resource}"][data-player-side="${side}"]`,
  );
  if (!anchor) return Promise.resolve();

  const rect = anchor.getBoundingClientRect();
  const span = document.createElement("span");
  span.className = `${classes.float} ${step.delta >= 0 ? classes.floatGained : classes.floatSpent}`;
  span.textContent = step.delta >= 0 ? `+${step.delta}` : `${step.delta}`;
  span.style.left = `${rect.left + rect.width / 2}px`;
  span.style.top = `${rect.top}px`;
  span.style.transform = "translate(-50%, 0)";

  overlay.appendChild(span);

  span.animate(
    [
      { transform: "translate(-50%, 0)", opacity: 0 },
      { transform: "translate(-50%, -12px)", opacity: 1, offset: 0.2 },
      { transform: "translate(-50%, -56px)", opacity: 0 },
    ],
    { duration: durationMs, easing: "ease-out", fill: "forwards" },
  );

  return new Promise((resolve) => {
    window.setTimeout(() => {
      span.remove();
      resolve();
    }, durationMs);
  });
}
