import type { FabReplacementCandidate } from "../../rules/process.ts";

type ConsumptionCandidate = Pick<FabReplacementCandidate, "replacementId" | "consumptionPolicy">;

/** Candidates whose consumption policy must be evaluated after committing a batch. */
export function selectReplacementConsumptionCandidates<T extends ConsumptionCandidate>(
  initiallyActive: readonly T[],
  commitCandidates: readonly T[],
  selectedOptionalIds: readonly string[],
  declinedOptionalIds: readonly string[],
): T[] {
  return [
    ...initiallyActive,
    ...commitCandidates.filter((candidate) => {
      if (initiallyActive.some((initial) => initial.replacementId === candidate.replacementId))
        return false;
      // Follow-up events can activate a previously ineligible replacement.
      // The committed applied-ID gate decides whether on-application policies
      // were used; potential eligibility alone must not consume an opportunity.
      const policy = candidate.consumptionPolicy;
      switch (policy.kind) {
        case "on-application":
          return true;
        case "on-opportunity":
          return (
            selectedOptionalIds.includes(candidate.replacementId) ||
            declinedOptionalIds.includes(candidate.replacementId)
          );
        case "never":
          return false;
      }
      const exhaustive: never = policy;
      return exhaustive;
    }),
  ];
}
