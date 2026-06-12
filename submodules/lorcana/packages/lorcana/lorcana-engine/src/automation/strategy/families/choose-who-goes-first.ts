import type { AutomatedActionCandidate, AutomatedActionPlanningContext } from "../../types";
import type { FamilyEvaluation, FamilyEvaluator } from "../internal-types";

type ChooseWhoGoesFirstCandidate = Extract<
  AutomatedActionCandidate,
  { family: "chooseWhoGoesFirst" }
>;

export const evaluateChooseWhoGoesFirst: FamilyEvaluator<ChooseWhoGoesFirstCandidate> = (
  context,
  candidate,
): FamilyEvaluation => ({
  ranking: {
    selfFirst: candidate.firstPlayerId === context.actorId,
  },
});

export function compareChooseWhoGoesFirst(
  left: FamilyEvaluation["ranking"],
  right: FamilyEvaluation["ranking"],
): number {
  if (left.selfFirst === right.selfFirst) {
    return 0;
  }

  return left.selfFirst ? -1 : 1;
}
