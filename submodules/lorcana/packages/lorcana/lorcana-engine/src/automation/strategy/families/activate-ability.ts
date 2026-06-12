import type { AutomatedActionCandidate } from "../../types";
import type { FamilyEvaluation, FamilyEvaluator } from "../internal-types";

type ActivateAbilityCandidate = Extract<AutomatedActionCandidate, { family: "activateAbility" }>;

function getAbilityComplexity(candidate: ActivateAbilityCandidate): number {
  return (
    (candidate.targets?.length ?? 0) +
    (candidate.costs?.banishCharacters?.length ?? 0) +
    (candidate.costs?.banishItems?.length ?? 0) +
    (candidate.costs?.discardCards?.length ?? 0) +
    (candidate.costs?.exertCharacters?.length ?? 0) +
    (typeof candidate.choiceIndex === "number" ? 1 : 0)
  );
}

export const evaluateActivateAbility: FamilyEvaluator<ActivateAbilityCandidate> = (
  _context,
  candidate,
): FamilyEvaluation => ({
  ranking: {
    abilityComplexity: getAbilityComplexity(candidate),
  },
});

export function compareActivateAbility(
  left: FamilyEvaluation["ranking"],
  right: FamilyEvaluation["ranking"],
): number {
  return (left.abilityComplexity ?? 0) - (right.abilityComplexity ?? 0);
}
