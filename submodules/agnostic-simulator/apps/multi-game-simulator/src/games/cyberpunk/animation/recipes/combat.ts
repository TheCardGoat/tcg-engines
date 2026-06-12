import type { CombatStep } from "../types";
import type { Side } from "../../engine";
import { findZoneElement } from "../zoneAnchor";
import classes from "../ScriptPlayer.module.css";

interface PlayCombatOptions {
  step: CombatStep;
  overlay: HTMLElement;
  durationMs: number;
  sideForPlayerId: (playerId: string) => Side | null;
}

function rectCenter(rect: DOMRect): { x: number; y: number } {
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

function findCardRect(cardId: string): DOMRect | null {
  const el = document.querySelector<HTMLElement>(`[data-card-id="${cardId}"]`);
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0 ? rect : null;
}

const IMPACT_CLASS = classes.combatImpact;

/**
 * Combat recipe — draws an attack arrow on `attackDeclared` and flashes an
 * impact on `attackResolved`. The same step kind handles both phases; we
 * distinguish via `step.reason` because the engine emits one event per phase.
 */
export function playCombat({
  step,
  overlay,
  durationMs,
  sideForPlayerId,
}: PlayCombatOptions): Promise<void> {
  const attackerRect = findCardRect(step.attackerId);
  if (!attackerRect) return Promise.resolve();

  let defenderRect: DOMRect | null = null;
  if (step.defenderId) {
    defenderRect = findCardRect(step.defenderId);
  } else {
    // Direct attack — anchor to the rival's eddies zone as the player target.
    const attackerSide = sideForPlayerId(step.playerId);
    if (attackerSide) {
      const rivalSide: Side = attackerSide === "player" ? "opponent" : "player";
      const zone = findZoneElement("eddieArea", rivalSide);
      if (zone) {
        const r = zone.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) defenderRect = r;
      }
    }
  }
  if (!defenderRect) return Promise.resolve();

  const sourcePt = rectCenter(attackerRect);
  const targetPt = rectCenter(defenderRect);
  const dx = targetPt.x - sourcePt.x;
  const dy = targetPt.y - sourcePt.y;
  const length = Math.hypot(dx, dy);
  if (length < 8) return Promise.resolve();
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

  const isDeclare = step.reason === "attackDeclared";
  const arrow = document.createElement("div");
  arrow.className = `${classes.combatArrow} ${isDeclare ? classes.combatArrowDeclare : classes.combatArrowResolve}`;
  arrow.style.left = `${sourcePt.x}px`;
  arrow.style.top = `${sourcePt.y}px`;
  arrow.style.width = `${length}px`;
  arrow.style.transformOrigin = "left center";

  if (isDeclare) {
    arrow.style.transform = `translate(0, -2px) rotate(${angle}deg) scaleX(0)`;
    overlay.appendChild(arrow);
    arrow.animate(
      [
        { transform: `translate(0, -2px) rotate(${angle}deg) scaleX(0)`, opacity: 0.85 },
        {
          transform: `translate(0, -2px) rotate(${angle}deg) scaleX(1)`,
          opacity: 1,
          offset: 0.55,
        },
        { transform: `translate(0, -2px) rotate(${angle}deg) scaleX(1)`, opacity: 0.85 },
      ],
      { duration: durationMs, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "forwards" },
    );
  } else {
    arrow.style.transform = `translate(0, -2px) rotate(${angle}deg) scaleX(1)`;
    overlay.appendChild(arrow);
    arrow.animate(
      [
        { opacity: 1, filter: "brightness(1.4)" },
        { opacity: 0, filter: "brightness(2)" },
      ],
      { duration: durationMs, easing: "ease-out", fill: "forwards" },
    );
    // Impact flash on the defender during resolve.
    const defenderEl = step.defenderId
      ? document.querySelector<HTMLElement>(`[data-card-id="${step.defenderId}"]`)
      : null;
    if (defenderEl) {
      defenderEl.classList.add(IMPACT_CLASS);
      window.setTimeout(() => defenderEl.classList.remove(IMPACT_CLASS), durationMs + 40);
    }
  }

  return new Promise((resolve) => {
    window.setTimeout(() => {
      arrow.remove();
      resolve();
    }, durationMs);
  });
}
