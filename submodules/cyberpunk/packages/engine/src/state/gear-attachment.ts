import { unitsAndLegendsInPlay } from "@tcg/cyberpunk-types";
import type { TargetDSL } from "@tcg/cyberpunk-types";
import { resolveTarget, type ResolutionContext } from "../effects/target-resolver.ts";
import type { CardInstanceId, PlayerId } from "../types/branded.ts";
import type { MatchState } from "../types/match-state.ts";
import { defOf } from "./lookups.ts";

/** Resolve the exact hosts to which a hand Gear may legally be attached. */
export function listLegalGearAttachHosts(
  state: MatchState,
  gearId: CardInstanceId,
  playerId: PlayerId,
  restriction?: { target: TargetDSL; context: ResolutionContext },
): string[] {
  const gear = state.G.cardIndex[gearId as string];
  if (!gear || defOf(gear).type !== "gear") return [];

  const target = defOf(gear).attachment?.target ?? unitsAndLegendsInPlay("friendly", "faceUp");
  const legalHosts = resolveTarget(target, {
    state,
    sourceCardId: gearId,
    sourcePlayerId: playerId,
    abilityIndex: -1,
    contextTargets: {},
    boundTargets: {},
  });
  if (!restriction) return legalHosts;
  const allowedByEffect = new Set(resolveTarget(restriction.target, restriction.context));
  return legalHosts.filter((id) => allowedByEffect.has(id));
}
