import type {
  AutomatedActionCandidateHeuristic,
  AutomatedActionCandidateSummary,
  AutomatedActionDecisionTrace,
} from "@tcg/lorcana-engine";

export type PresentedDecisionField = {
  key: string;
  label: string;
  value: string;
};

export type PresentedDecisionCandidate = {
  family: AutomatedActionCandidateSummary["family"];
  fields: PresentedDecisionField[];
  policyDecision?: string;
  policyMatched: boolean;
  policyReason?: string;
  stableKey: string;
};

export type PresentedDecisionTrace = {
  diagnosticCount: number;
  fallbackTaken?: AutomatedActionDecisionTrace["fallbackTaken"];
  selectedCandidate?: PresentedDecisionCandidate;
  topCandidates: PresentedDecisionCandidate[];
};

const HEURISTIC_LABELS: Partial<Record<string, string>> = {
  abilityComplexity: "Ability complexity",
  challengeLoreSwing: "Lore swing",
  deckAwareTotalScore: "Deck-aware score",
  familyOrder: "Family order",
  informationPolicy: "Info policy",
  opponentKnowledgeSource: "Opponent knowledge",
  playCardComplexity: "Play complexity",
  printedLore: "Printed lore",
  resolveBenefitScore: "Benefit score",
  resolveComplexity: "Resolution complexity",
  resolveOptionalAccepted: "Accept optional",
  resolvePolicyAllHandCardsUninkable: "All hand cards uninkable",
  resolvePolicyDecision: "Policy decision",
  resolvePolicyHandSize: "Hand size",
  resolvePolicyMatched: "Policy matched",
  resolvePolicyReason: "Policy reason",
  resolvePolicyUninkableHandCount: "Uninkable cards in hand",
  topWeightContributors: "Top contributors",
};

const DISPLAY_PRIORITY = [
  "resolvePolicyMatched",
  "resolvePolicyDecision",
  "resolvePolicyReason",
  "resolvePolicyHandSize",
  "resolvePolicyUninkableHandCount",
  "resolvePolicyAllHandCardsUninkable",
  "resolveBenefitScore",
  "resolveOptionalAccepted",
  "resolveComplexity",
  "familyOrder",
  "deckAwareTotalScore",
  "informationPolicy",
  "opponentKnowledgeSource",
  "topWeightContributors",
  "printedLore",
  "playCardComplexity",
  "abilityComplexity",
  "challengeLoreSwing",
] as const;

const POLICY_DECISION_LABELS: Record<string, string> = {
  accept: "Accept optional effect",
  decline: "Decline optional effect",
  none: "No card-specific policy",
};

const POLICY_REASON_LABELS: Record<string, string> = {
  "all-hand-cards-uninkable": "Every card in hand is uninkable.",
  "hand-size-at-most-two": "Hand size is 2 or less.",
  "keep-larger-inkable-hand": "Keep the larger hand because it still contains inkable cards.",
  "no-card-specific-policy": "No card-specific policy matched this decision.",
};

function formatHeuristicValue(heuristic: AutomatedActionCandidateHeuristic): string {
  if (heuristic.key === "resolvePolicyDecision" && typeof heuristic.value === "string") {
    return POLICY_DECISION_LABELS[heuristic.value] ?? heuristic.value;
  }

  if (heuristic.key === "resolvePolicyReason" && typeof heuristic.value === "string") {
    return POLICY_REASON_LABELS[heuristic.value] ?? heuristic.value;
  }

  if (typeof heuristic.value === "boolean") {
    return heuristic.value ? "Yes" : "No";
  }

  return String(heuristic.value);
}

function toPresentedField(heuristic: AutomatedActionCandidateHeuristic): PresentedDecisionField {
  return {
    key: heuristic.key,
    label: HEURISTIC_LABELS[heuristic.key] ?? heuristic.key,
    value: formatHeuristicValue(heuristic),
  };
}

function buildCandidatePresentation(
  candidate: AutomatedActionCandidateSummary,
  maxFields: number,
): PresentedDecisionCandidate {
  const heuristicByKey = new Map(
    candidate.heuristics.map((heuristic) => [heuristic.key, heuristic] as const),
  );
  const fields: PresentedDecisionField[] = [];
  const seen = new Set<string>();

  for (const key of DISPLAY_PRIORITY) {
    const heuristic = heuristicByKey.get(key);
    if (!heuristic) {
      continue;
    }

    fields.push(toPresentedField(heuristic));
    seen.add(key);
    if (fields.length >= maxFields) {
      break;
    }
  }

  if (fields.length < maxFields) {
    for (const heuristic of candidate.heuristics) {
      if (heuristic.key === "stableKey" || seen.has(heuristic.key)) {
        continue;
      }

      fields.push(toPresentedField(heuristic));
      seen.add(heuristic.key);
      if (fields.length >= maxFields) {
        break;
      }
    }
  }

  const policyMatched = heuristicByKey.get("resolvePolicyMatched")?.value === true;
  const policyDecision = heuristicByKey.get("resolvePolicyDecision")?.value;
  const policyReason = heuristicByKey.get("resolvePolicyReason")?.value;

  return {
    family: candidate.family,
    fields,
    policyDecision:
      typeof policyDecision === "string"
        ? formatHeuristicValue({
            direction: "asc",
            key: "resolvePolicyDecision",
            value: policyDecision,
          })
        : undefined,
    policyMatched,
    policyReason:
      typeof policyReason === "string"
        ? formatHeuristicValue({
            direction: "asc",
            key: "resolvePolicyReason",
            value: policyReason,
          })
        : undefined,
    stableKey: candidate.stableKey,
  };
}

export function buildPresentedDecisionTrace(
  trace: AutomatedActionDecisionTrace | undefined,
): PresentedDecisionTrace | undefined {
  if (!trace) {
    return undefined;
  }

  return {
    diagnosticCount: trace.diagnostics.length,
    fallbackTaken: trace.fallbackTaken,
    selectedCandidate: trace.selectedCandidate
      ? buildCandidatePresentation(trace.selectedCandidate, 6)
      : undefined,
    topCandidates: trace.orderedCandidates.slice(0, 3).map((candidate) => {
      return buildCandidatePresentation(candidate, 4);
    }),
  };
}
