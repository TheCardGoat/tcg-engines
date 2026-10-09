import type { EngineInteractionView } from "@tcg/protocol";
import type { CSSProperties } from "react";
/** Shared selection treatment for opening cards. Matches Cyberpunk BoardV2's selected rim. */
export const cardSelection = {
  scale: 1.08,
  lift: 12,
  rim: "#f5e642",
  glow: "#f5e64255",
} as const;

export const selectionVariables: CSSProperties & Record<string, string | number> = {
  "--selection-rim": cardSelection.rim,
  "--selection-glow": cardSelection.glow,
  "--selection-scale": cardSelection.scale,
  "--selection-lift": `${cardSelection.lift}px`,
};

/** Action sources, not effect targets. Games supply legal, viewer-safe actions. */
export function availableInteractionCardIds(view: EngineInteractionView): ReadonlySet<string> {
  const ids = new Set<string>();
  if (view.projectionFailure || view.status === "game-over" || view.status === "waiting")
    return ids;
  for (const action of view.actions) {
    if (!action.enabled) continue;
    if (action.source?.instanceId) ids.add(action.source.instanceId);
    for (const input of action.inputs) {
      if (input.kind !== "entity-selection" || input.role !== "source") continue;
      for (const candidate of input.candidates)
        if (candidate.enabled && candidate.entity.instanceId) ids.add(candidate.entity.instanceId);
    }
  }
  return ids;
}
