import type { TargetSelectionDSL } from "@tcg/cyberpunk-types";
import type { MatchState } from "../types/match-state.ts";
import { DIE_MAX_VALUES } from "../types/gig-die.ts";

type GigCopyPairConstraint = NonNullable<TargetSelectionDSL["pairConstraint"]>;

export function isValidGigCopyPair(
  state: MatchState,
  targetIds: readonly string[],
  constraint: GigCopyPairConstraint,
): boolean {
  if (targetIds.length !== 2 || targetIds[0] === targetIds[1]) return false;
  const source = state.G.gigDice[targetIds[0]!];
  const target = state.G.gigDice[targetIds[1]!];
  if (!source || !target) return false;
  if (
    constraint === "gig-copy-between-players" &&
    (source.ownerId as string) === (target.ownerId as string)
  ) {
    return false;
  }
  return (
    source.faceValue !== target.faceValue && source.faceValue <= DIE_MAX_VALUES[target.dieType]
  );
}

export function hasValidGigCopyPair(
  state: MatchState,
  eligibleIds: readonly string[],
  constraint: GigCopyPairConstraint,
): boolean {
  return eligibleIds.some((sourceId) =>
    eligibleIds.some((targetId) => isValidGigCopyPair(state, [sourceId, targetId], constraint)),
  );
}
