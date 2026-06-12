import type { CardDomCache, GigMoveStep } from "../types";
import type { Side } from "../../engine";
import classes from "../ScriptPlayer.module.css";

const HIDDEN_CLASS = classes.hiddenForAnim;
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

interface PlayGigMoveOptions {
  step: GigMoveStep;
  cache: CardDomCache;
  overlay: HTMLElement;
  durationMs: number;
  sideForPlayerId: (playerId: string) => Side | null;
}

interface DieAnchor {
  rect: DOMRect;
  outerHTML?: string;
  el?: HTMLElement;
}

function stripIdentityAttributes(node: HTMLElement): void {
  node.removeAttribute("data-testid");
  node.removeAttribute("data-die-id");
  for (const inner of node.querySelectorAll<HTMLElement>("[data-die-id]")) {
    inner.removeAttribute("data-die-id");
  }
}

function centeredRect(zone: HTMLElement, width: number, height: number): DOMRect | null {
  const rect = zone.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return null;
  return new DOMRect(
    rect.left + rect.width / 2 - width / 2,
    rect.top + rect.height / 2 - height / 2,
    width,
    height,
  );
}

function zoneElement(zone: "fixerArea" | "gigArea", side: Side): HTMLElement | null {
  const testId = zone === "fixerArea" ? "fixer-zone" : "gig-row";
  return document.querySelector<HTMLElement>(`[data-testid="${testId}"][data-side="${side}"]`);
}

function fallbackAnchor(
  zone: "fixerArea" | "gigArea",
  side: Side | null,
  width: number,
  height: number,
): DieAnchor | null {
  if (!side) return null;
  const zoneEl = zoneElement(zone, side);
  if (!zoneEl) return null;
  const rect = centeredRect(zoneEl, width, height);
  return rect ? { rect } : null;
}

function findLiveDie(dieId: string): DieAnchor | null {
  const el = document.querySelector<HTMLElement>(`[data-die-id="${dieId}"]`);
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return null;
  return { rect, outerHTML: el.outerHTML, el };
}

function ghostFromHtml(outerHTML: string): HTMLElement | null {
  const template = document.createElement("div");
  template.innerHTML = outerHTML.trim();
  const ghost = template.firstElementChild;
  return ghost instanceof HTMLElement ? ghost : null;
}

export function playGigMove({
  step,
  cache,
  overlay,
  durationMs,
  sideForPlayerId,
}: PlayGigMoveOptions): Promise<void> {
  const toSide = sideForPlayerId(step.toPlayerId);
  const fromSide = sideForPlayerId(step.fromPlayerId);
  const liveTarget = findLiveDie(step.dieId);
  const cachedSource = cache.previousDice.get(step.dieId);
  const target =
    liveTarget ??
    fallbackAnchor(
      step.to,
      toSide,
      cachedSource?.rect.width ?? 42,
      cachedSource?.rect.height ?? 42,
    );
  if (!target) return Promise.resolve();

  const source =
    cachedSource ?? fallbackAnchor(step.from, fromSide, target.rect.width, target.rect.height);
  if (!source) return Promise.resolve();

  const ghost = ghostFromHtml(source.outerHTML ?? target.outerHTML ?? "");
  if (!ghost) return Promise.resolve();
  stripIdentityAttributes(ghost);
  ghost.classList.add(classes.ghost, classes.gigGhost);
  if (step.moveKind === "steal") {
    ghost.classList.add(classes.gigGhostSteal);
  }
  ghost.style.left = `${target.rect.left}px`;
  ghost.style.top = `${target.rect.top}px`;
  ghost.style.width = `${target.rect.width}px`;
  ghost.style.height = `${target.rect.height}px`;
  ghost.style.transformOrigin = "center";

  overlay.appendChild(ghost);
  target.el?.classList.add(HIDDEN_CLASS);

  const dx = source.rect.left - target.rect.left;
  const dy = source.rect.top - target.rect.top;
  const sx = source.rect.width / target.rect.width;
  const sy = source.rect.height / target.rect.height;
  const arc = step.moveKind === "steal" ? -18 : -10;

  ghost.animate(
    [
      {
        transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`,
        opacity: 1,
        filter: "brightness(1)",
      },
      {
        transform: `translate(${dx / 2}px, ${dy / 2 + arc}px) scale(1.18, 1.18)`,
        opacity: 1,
        filter: "brightness(1.35)",
        offset: 0.55,
      },
      {
        transform: "translate(0, 0) scale(1, 1)",
        opacity: 1,
        filter: "brightness(1)",
      },
    ],
    { duration: durationMs, easing: EASE, fill: "forwards" },
  );

  return new Promise((resolve) => {
    window.setTimeout(() => {
      ghost.remove();
      target.el?.classList.remove(HIDDEN_CLASS);
      resolve();
    }, durationMs);
  });
}
