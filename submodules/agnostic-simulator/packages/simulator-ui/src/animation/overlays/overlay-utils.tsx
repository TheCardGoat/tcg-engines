import type { AnimationRef } from "@tcg/protocol/animations";

import type { AnimationNodePresence, AnimationNodeRegistry } from "../lib/node-registry";

/** Optional board-local anchor for game surfaces with a stable central play row. */
export const simulatorBoardCenterAnimationRef = {
  kind: "anchor",
  id: "simulator:board-center",
} as const;

function boardOverlayNode(registry: AnimationNodeRegistry): Element | null {
  const explicitBoardCenter =
    typeof document === "undefined"
      ? null
      : document.querySelector("[data-animation-board-center]");
  return (
    explicitBoardCenter ?? registry.getPreferred(simulatorBoardCenterAnimationRef)?.node ?? null
  );
}

export function centerForRef(
  registry: AnimationNodeRegistry,
  ref: AnimationRef | undefined,
  preferredPresence?: AnimationNodePresence,
): { x: number; y: number } | null {
  if (!ref) return null;
  const preferred =
    preferredPresence === undefined
      ? registry.getPreferred(ref)
      : (registry.get(ref).find((record) => record.presence === preferredPresence) ??
        registry.getPreferred(ref));
  const rect = preferred?.node.getBoundingClientRect();
  return rect ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } : null;
}

export function centerForBoardOverlay(registry: AnimationNodeRegistry) {
  const rect = boardOverlayNode(registry)?.getBoundingClientRect();
  return rect ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } : null;
}

/** Optional game-owned surface where routine phase feedback should be rendered. */
export function rectForPhaseChangeOverlayAnchor() {
  if (typeof document === "undefined") return null;
  const node = [...document.querySelectorAll("[data-animation-phase-change-anchor]")].find(
    (candidate) => candidate.getBoundingClientRect().width > 0,
  );
  const rect = node?.getBoundingClientRect();
  return rect
    ? {
        center: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
        width: rect.width,
      }
    : null;
}

export function cssVariableForBoardOverlay(
  registry: AnimationNodeRegistry,
  property: `--${string}`,
): string | null {
  const node = boardOverlayNode(registry);
  if (!node || typeof window === "undefined") return null;
  return window.getComputedStyle(node).getPropertyValue(property).trim() || null;
}

export function overlayPortalRoot(children: React.ReactNode) {
  return (
    <div
      aria-hidden
      data-animation-overlay-layer=""
      style={{ position: "fixed", inset: 0, zIndex: 10_001, pointerEvents: "none" }}
    >
      {children}
    </div>
  );
}
