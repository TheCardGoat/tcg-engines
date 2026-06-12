import type { AutomatedActionCandidate } from "../../types";
import type { FamilyEvaluation, FamilyEvaluator } from "../internal-types";
import { getPrintedLore } from "../common";

type QuestCandidate = Extract<AutomatedActionCandidate, { family: "quest" }>;

export const evaluateQuest: FamilyEvaluator<QuestCandidate> = (
  context,
  candidate,
): FamilyEvaluation => ({
  ranking: {
    printedLore: getPrintedLore(context, candidate.cardId),
  },
});

export function compareQuest(
  left: FamilyEvaluation["ranking"],
  right: FamilyEvaluation["ranking"],
): number {
  return (right.printedLore ?? 0) - (left.printedLore ?? 0);
}
