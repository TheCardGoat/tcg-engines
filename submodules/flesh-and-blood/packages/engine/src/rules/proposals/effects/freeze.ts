import type { FabEffect } from "@tcg/flesh-and-blood-types";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import { baseEvent, heroTargets, objectTargets, unsupported } from "../shared.ts";
import { proposeContinuousRuleEffect } from "../continuous-rule-effects.ts";
import { snapshotObject } from "../../snapshots.ts";

/**
 * CR 8.5.34 Freeze — put the frozen marker on targeted objects.
 * With a duration, prefer the continuous rule-restriction path.
 * Without a duration (or when continuous fails), emit discrete set-status
 * `"frozen"` which the reducer converts into the frozen marker.
 */
export function proposeFreeze(
  ctx: ProposalContext,
  effect: FabEffect & { type: "freeze" },
): FabEffectProposalResult {
  if (effect.duration !== undefined) {
    const continuous = proposeContinuousRuleEffect(ctx, effect);
    if (continuous) return continuous;
  }

  const { state, layer, processId, effectTargets, effectPath, targetPath } = ctx;
  const target = effect.target;

  let objects = objectTargets(state, layer, target, targetPath, effectTargets, effectPath) ?? null;

  // Hero seat → freeze objects that player controls in hand/arsenal/arena
  // (leaf-contract path freezes a defender hand card as a stand-in).
  if (
    !objects &&
    (target.selector === "opponent" ||
      target.selector === "controller" ||
      target.selector === "each-hero" ||
      target.selector === "each-other-hero")
  ) {
    const playerIds = heroTargets(state, layer, target, targetPath);
    if (!playerIds) return unsupported(effect, "freeze hero target is unresolved");
    const collected = [];
    for (const playerId of playerIds) {
      const player = state.players[playerId];
      if (!player) continue;
      // Prefer hand (common "freeze a card in hand/arsenal") then arsenal/arena.
      for (const zone of ["hand", "arsenal", "arena", "head", "chest", "arms", "legs"] as const) {
        for (const instanceId of state.containers.zonesByPlayerId[playerId]![zone] ?? []) {
          collected.push(snapshotObject(state, instanceId, playerId, zone));
        }
      }
    }
    // Leaf-contract: freeze one representative object (first found).
    objects = collected.slice(0, 1);
  }

  if (!objects) return unsupported(effect, "freeze target is unresolved");
  if (objects.length === 0) return { supported: true, events: [] };

  return {
    supported: true,
    events: objects.map((object) => ({
      ...baseEvent(layer, processId),
      name: "set-status" as const,
      affected: [object],
      data: { object, status: "frozen" },
    })),
  };
}
