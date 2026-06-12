import type { CardInstanceId, MoveEnumerationContext, PlayerId } from "#core";
import type { LorcanaCard } from "@tcg/lorcana-types";
import type { LorcanaG } from "../types";

export * from "./runtime";

export type ActionTargetResolutionContext = Pick<
  MoveEnumerationContext,
  "G" | "framework" | "cards"
>;

export type ActionSelectionZone = "deck" | "hand" | "play" | "discard" | "inkwell" | "limbo";

export function inferActionSelectionZonesFromCandidates(
  candidateIds: readonly CardInstanceId[],
  ctx: ActionTargetResolutionContext,
): ActionSelectionZone[] {
  const zones = new Set<ActionSelectionZone>();

  for (const candidateId of candidateIds) {
    const zoneKey = ctx.framework.zones.getCardZone(candidateId);
    const zone = zoneKey?.split(":")[0];
    if (
      zone === "deck" ||
      zone === "hand" ||
      zone === "play" ||
      zone === "discard" ||
      zone === "inkwell" ||
      zone === "limbo"
    ) {
      zones.add(zone);
    }
  }

  return [...zones];
}

export function isCardInstanceCandidate(
  candidateId: CardInstanceId | PlayerId,
  ctx: ActionTargetResolutionContext,
): candidateId is CardInstanceId {
  return candidateId in ctx.framework.state._zonesPrivate.cardIndex;
}
