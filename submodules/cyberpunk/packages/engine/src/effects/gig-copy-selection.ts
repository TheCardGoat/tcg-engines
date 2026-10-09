import { isGigCopyPairAllowed, type TargetSelectionDSL } from "@tcg/cyberpunk-types";
import type { MatchState } from "../types/match-state.ts";

type GigCopyPairConstraint = NonNullable<TargetSelectionDSL["pairConstraint"]>;

export type GigCopyPairInvalidReason = "wrong-count" | "duplicate" | "missing-gig" | "same-player";

export type GigCopyPairValidation =
  | { valid: true }
  | { valid: false; reason: GigCopyPairInvalidReason };

export function validateGigCopyPair(
  state: MatchState,
  targetIds: readonly string[],
  constraint: GigCopyPairConstraint,
): GigCopyPairValidation {
  if (targetIds.length !== 2) return { valid: false, reason: "wrong-count" };
  if (targetIds[0] === targetIds[1]) return { valid: false, reason: "duplicate" };
  const source = state.G.gigDice[targetIds[0]!];
  const target = state.G.gigDice[targetIds[1]!];
  if (!source || !target) return { valid: false, reason: "missing-gig" };
  return isGigCopyPairAllowed(source.ownerId as string, target.ownerId as string, constraint)
    ? { valid: true }
    : { valid: false, reason: "same-player" };
}

export function isValidGigCopyPair(
  state: MatchState,
  targetIds: readonly string[],
  constraint: GigCopyPairConstraint,
): boolean {
  return validateGigCopyPair(state, targetIds, constraint).valid;
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
