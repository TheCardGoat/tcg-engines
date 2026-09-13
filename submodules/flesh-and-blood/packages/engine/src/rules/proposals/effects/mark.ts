import type { FabEffect } from "@tcg/flesh-and-blood-types";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import { baseEvent, heroTargets, objectTargets, unsupported } from "../shared.ts";
import { snapshotObject } from "../../snapshots.ts";

/**
 * CR 8.5.50 / 9.3 Mark — set the marked game-rule flag on the targeted hero's
 * controller. Hero selectors resolve seats; object targets must resolve to a
 * hero object. Marked is never a condition on a non-hero object (CR 9.3.1).
 *
 * Emits `set-status` with status `"marked"` on the hero object; the reducer
 * also stamps `player.marked = true` for the CR-visible player flag.
 */
export function proposeMark(
  ctx: ProposalContext,
  effect: FabEffect & { type: "mark" },
): FabEffectProposalResult {
  const { state, layer, processId, effectTargets, effectPath, targetPath } = ctx;
  const target = effect.target;

  // Hero seat selectors (opponent / controller / attack-target / …).
  // "When this hits a hero, mark them" (Rage Baiters grant, Mark the Prey)
  // uses selector attack-target → defendingPlayerId via heroTargets.
  if (
    target.selector === "opponent" ||
    target.selector === "controller" ||
    target.selector === "each-hero" ||
    target.selector === "each-other-hero" ||
    target.selector === "self" ||
    target.selector === "attack-target" ||
    target.selector === "defending-hero" ||
    target.selector === "attacking-hero"
  ) {
    const playerIds =
      target.selector === "self"
        ? [layer.controllerId]
        : heroTargets(state, layer, target, targetPath);
    if (!playerIds) return unsupported(effect, "mark hero target is unresolved");
    if (playerIds.length === 0) return { supported: true, events: [] };
    const events = [];
    for (const playerId of playerIds) {
      const heroId = state.containers.zonesByPlayerId[playerId]?.heroZone[0];
      if (!heroId) continue;
      const hero = snapshotObject(state, heroId, playerId, "heroZone");
      events.push({
        ...baseEvent(layer, processId),
        name: "set-status" as const,
        affected: [hero],
        data: { object: hero, status: "marked" },
      });
    }
    return { supported: true, events };
  }

  const objects = objectTargets(state, layer, target, targetPath, effectTargets, effectPath);
  if (!objects) return unsupported(effect, "mark target is unresolved");
  if (objects.length === 0) return { supported: true, events: [] };
  if (objects.some((object) => object.zoneRef.zone !== "heroZone")) {
    return unsupported(effect, "mark target must be a hero");
  }
  return {
    supported: true,
    events: objects.map((object) => ({
      ...baseEvent(layer, processId),
      name: "set-status" as const,
      affected: [object],
      data: { object, status: "marked" },
    })),
  };
}
