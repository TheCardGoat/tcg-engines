import type { TargetDSL } from "@tcg/cyberpunk-types";
import { resolveTarget } from "../effects/target-resolver.ts";
import type { CardInstanceId, PlayerId } from "../types/branded.ts";
import type { MatchState } from "../types/match-state.ts";
import { defOf } from "./lookups.ts";

const defaultGearAttachmentTarget = {
  selector: "card",
  controller: "friendly",
  zones: ["field", "legendArea"],
  cardTypes: ["unit", "legend"],
  face: "faceUp",
} satisfies TargetDSL;

/** Resolve the exact hosts to which a hand Gear may legally be attached. */
export function listLegalGearAttachHosts(
  state: MatchState,
  gearId: CardInstanceId,
  playerId: PlayerId,
): string[] {
  const gear = state.G.cardIndex[gearId as string];
  if (!gear || defOf(gear).type !== "gear") return [];

  const target = defOf(gear).attachment?.target ?? defaultGearAttachmentTarget;
  return resolveTarget(target, {
    state,
    sourceCardId: gearId,
    sourcePlayerId: playerId,
    abilityIndex: -1,
    contextTargets: {},
    boundTargets: {},
  });
}
