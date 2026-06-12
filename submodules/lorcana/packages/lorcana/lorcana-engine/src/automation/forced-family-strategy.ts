import { createHeuristic } from "./strategy/common";
import { deckAwareLoreRaceAutomatedActionStrategy } from "./deck-aware-strategy";
import type {
  AutomatedActionCandidateSummary,
  AutomatedActionFamily,
  AutomatedActionPlanningContext,
  AutomatedActionStrategy,
} from "./types";

const ALWAYS_ALLOWED_SHARED_FAMILIES: readonly AutomatedActionFamily[] = [
  "chooseWhoGoesFirst",
  "alterHand",
  "resolveBag",
  "resolveEffect",
];

type ForcedGameplayFamily = Extract<AutomatedActionFamily, "challenge" | "quest">;

function isSharedFamily(family: AutomatedActionFamily): boolean {
  return ALWAYS_ALLOWED_SHARED_FAMILIES.includes(family);
}

function getForcedFamilyBucket(args: {
  family: AutomatedActionFamily;
  forcedFamily: ForcedGameplayFamily;
  hasForcedFamilyCandidate: boolean;
}): number {
  if (isSharedFamily(args.family)) {
    return 0;
  }

  if (args.hasForcedFamilyCandidate && args.family === args.forcedFamily) {
    return 1;
  }

  return args.hasForcedFamilyCandidate ? 2 : 1;
}

function appendForcedFamilyHeuristics(args: {
  fallbackUsed: boolean;
  forcedFamily: ForcedGameplayFamily;
  strategyName: string;
  summary: AutomatedActionCandidateSummary;
}): AutomatedActionCandidateSummary {
  const matched = args.summary.family === args.forcedFamily;

  return {
    ...args.summary,
    heuristics: [
      ...args.summary.heuristics,
      createHeuristic("asc", "forcedFamilyMode", args.strategyName),
      createHeuristic("preferTrue", "forcedFamilyMatched", matched),
      createHeuristic(
        "preferTrue",
        "forcedFamilyFallbackUsed",
        args.fallbackUsed && !isSharedFamily(args.summary.family),
      ),
    ],
  };
}

export function createForcedFamilyAutomatedActionStrategy(args: {
  baseStrategy: AutomatedActionStrategy;
  forcedFamily: ForcedGameplayFamily;
  name: string;
}): AutomatedActionStrategy {
  return {
    name: args.name,
    summarizeCandidates(
      context: AutomatedActionPlanningContext,
      candidates,
    ): AutomatedActionCandidateSummary[] {
      const baseSummaries = args.baseStrategy.summarizeCandidates(context, candidates);
      const hasForcedFamilyCandidate = baseSummaries.some(
        (summary) => summary.family === args.forcedFamily,
      );
      const fallbackUsed = !hasForcedFamilyCandidate;

      return baseSummaries
        .map((summary, baseIndex) => ({
          baseIndex,
          bucket: getForcedFamilyBucket({
            family: summary.family,
            forcedFamily: args.forcedFamily,
            hasForcedFamilyCandidate,
          }),
          summary: appendForcedFamilyHeuristics({
            fallbackUsed,
            forcedFamily: args.forcedFamily,
            strategyName: args.name,
            summary,
          }),
        }))
        .sort((left, right) => {
          if (left.bucket !== right.bucket) {
            return left.bucket - right.bucket;
          }

          return left.baseIndex - right.baseIndex;
        })
        .map((entry) => entry.summary);
    },
  };
}

export const QUEST_ONLY_TEST_STRATEGY_ID = "quest-only-test";
export const CHALLENGE_ONLY_TEST_STRATEGY_ID = "challenge-only-test";

export const questOnlyTestAutomatedActionStrategy = createForcedFamilyAutomatedActionStrategy({
  baseStrategy: deckAwareLoreRaceAutomatedActionStrategy,
  forcedFamily: "quest",
  name: QUEST_ONLY_TEST_STRATEGY_ID,
});

export const challengeOnlyTestAutomatedActionStrategy = createForcedFamilyAutomatedActionStrategy({
  baseStrategy: deckAwareLoreRaceAutomatedActionStrategy,
  forcedFamily: "challenge",
  name: CHALLENGE_ONLY_TEST_STRATEGY_ID,
});
