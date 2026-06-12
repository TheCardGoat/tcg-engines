import {
  bestDeckAwareLoreRaceAutomatedActionStrategy,
  bestDeckAwareOracleLoreRaceAutomatedActionStrategy,
  deckAwareLoreRaceAutomatedActionStrategy,
} from "./deck-aware-strategy";
import { DECK_AWARE_COLOR_PAIR_IDS } from "./deck-profile";
import {
  aggressiveBoardControlLoreRaceAutomatedActionStrategy,
  boardControlLoreRaceAutomatedActionStrategy,
} from "./default-strategy";
import {
  CHALLENGE_ONLY_TEST_STRATEGY_ID,
  QUEST_ONLY_TEST_STRATEGY_ID,
  challengeOnlyTestAutomatedActionStrategy,
  questOnlyTestAutomatedActionStrategy,
} from "./forced-family-strategy";
import type { AutomatedActionStrategy } from "./types";

export interface AutomatedActionStrategyOption {
  id: string;
  label: string;
  description: string;
  parentStrategyId?: string;
  strategy: AutomatedActionStrategy;
  supportedActorColorPairs?: readonly string[];
  testOnly?: boolean;
}

export const DECK_AWARE_LORE_RACE_STRATEGY_ID = "deck-aware-lore-race";
export const DEFAULT_AUTOMATED_ACTION_STRATEGY_ID = DECK_AWARE_LORE_RACE_STRATEGY_ID;
export const BEST_DECK_AWARE_LORE_RACE_STRATEGY_ID = "best-deck-aware-lore-race";
export const BEST_DECK_AWARE_ORACLE_LORE_RACE_STRATEGY_ID = "best-deck-aware-oracle-lore-race";
export const BOARD_CONTROL_LORE_RACE_STRATEGY_ID = "board-control-lore-race";
export const AGGRESSIVE_BOARD_CONTROL_LORE_RACE_STRATEGY_ID = "aggressive-board-control-lore-race";
export { CHALLENGE_ONLY_TEST_STRATEGY_ID, QUEST_ONLY_TEST_STRATEGY_ID };

export const AUTOMATED_ACTION_STRATEGIES: readonly AutomatedActionStrategyOption[] = [
  {
    id: DECK_AWARE_LORE_RACE_STRATEGY_ID,
    label: "Deck-aware lore race",
    description:
      "Uses deck color, matchup, and per-card weighting for mulligans, inking, and target selection.",
    strategy: deckAwareLoreRaceAutomatedActionStrategy,
    supportedActorColorPairs: DECK_AWARE_COLOR_PAIR_IDS,
  },
  {
    id: BEST_DECK_AWARE_LORE_RACE_STRATEGY_ID,
    label: "Best deck-aware lore race",
    description:
      "Candidate fair-information strategy that uses typed deck dossiers, matchup plans, and card rules without hidden opponent deck access.",
    parentStrategyId: DECK_AWARE_LORE_RACE_STRATEGY_ID,
    strategy: bestDeckAwareLoreRaceAutomatedActionStrategy,
  },
  {
    id: BEST_DECK_AWARE_ORACLE_LORE_RACE_STRATEGY_ID,
    label: "Best deck-aware oracle lore race",
    description:
      "Candidate strongest-play oracle variant that reuses the typed matchup system while allowing full opponent deck knowledge.",
    parentStrategyId: BEST_DECK_AWARE_LORE_RACE_STRATEGY_ID,
    strategy: bestDeckAwareOracleLoreRaceAutomatedActionStrategy,
  },
  {
    id: BOARD_CONTROL_LORE_RACE_STRATEGY_ID,
    label: "Board control lore race",
    description:
      "Pressures lore while trading off tempo to remove opposing quest threats and develop stable permanents.",
    parentStrategyId: DECK_AWARE_LORE_RACE_STRATEGY_ID,
    strategy: boardControlLoreRaceAutomatedActionStrategy,
  },
  {
    id: AGGRESSIVE_BOARD_CONTROL_LORE_RACE_STRATEGY_ID,
    label: "Aggressive board control lore race",
    description:
      "Reuses the stable opening plan but pushes harder into value trades and mutual-banish challenges to break opposing boards.",
    strategy: aggressiveBoardControlLoreRaceAutomatedActionStrategy,
  },
  {
    id: QUEST_ONLY_TEST_STRATEGY_ID,
    label: "Quest only test",
    description:
      "Test/debug strategy that forces quest-first gameplay while still using the shared setup, prompt resolution, and target-selection behavior.",
    strategy: questOnlyTestAutomatedActionStrategy,
    testOnly: true,
  },
  {
    id: CHALLENGE_ONLY_TEST_STRATEGY_ID,
    label: "Challenge only test",
    description:
      "Test/debug strategy that forces challenge-first gameplay while still using the shared setup, prompt resolution, and target-selection behavior.",
    strategy: challengeOnlyTestAutomatedActionStrategy,
    testOnly: true,
  },
];

export function getAutomatedActionStrategyOption(
  strategyId: string,
): AutomatedActionStrategyOption | undefined {
  return AUTOMATED_ACTION_STRATEGIES.find((option) => option.id === strategyId);
}

export function getSafeAutomatedActionStrategyOption(
  strategyId?: string | null,
): AutomatedActionStrategyOption {
  const requestedOption = strategyId ? getAutomatedActionStrategyOption(strategyId) : undefined;
  if (requestedOption) {
    return requestedOption;
  }

  const defaultOption =
    getAutomatedActionStrategyOption(DEFAULT_AUTOMATED_ACTION_STRATEGY_ID) ??
    AUTOMATED_ACTION_STRATEGIES[0];
  if (defaultOption) {
    return defaultOption;
  }

  throw new Error("No automated action strategies are registered.");
}

function getStrategyLineageDepth(
  option: AutomatedActionStrategyOption,
  ancestorStrategyId: string,
): number {
  if (option.id === ancestorStrategyId) {
    return 0;
  }

  let depth = 0;
  let currentParentStrategyId = option.parentStrategyId;

  while (currentParentStrategyId) {
    depth += 1;
    if (currentParentStrategyId === ancestorStrategyId) {
      return depth;
    }

    currentParentStrategyId =
      getAutomatedActionStrategyOption(currentParentStrategyId)?.parentStrategyId;
  }

  return -1;
}

export function resolveAutomatedActionStrategyOption(args: {
  actorColorPairId?: string;
  strategyId: string;
}): AutomatedActionStrategyOption | undefined {
  const requestedOption = getSafeAutomatedActionStrategyOption(args.strategyId);

  if (!args.actorColorPairId) {
    return requestedOption;
  }

  const actorColorPairId = args.actorColorPairId;

  const matchingChildOptions = AUTOMATED_ACTION_STRATEGIES.map((option, index) => ({
    index,
    lineageDepth: getStrategyLineageDepth(option, requestedOption.id),
    option,
  }))
    .filter(
      ({ lineageDepth, option }) =>
        lineageDepth > 0 && option.supportedActorColorPairs?.includes(actorColorPairId) === true,
    )
    .sort((left, right) => {
      if (left.lineageDepth !== right.lineageDepth) {
        return right.lineageDepth - left.lineageDepth;
      }

      const leftSpecificity =
        left.option.supportedActorColorPairs?.length ?? Number.MAX_SAFE_INTEGER;
      const rightSpecificity =
        right.option.supportedActorColorPairs?.length ?? Number.MAX_SAFE_INTEGER;
      if (leftSpecificity !== rightSpecificity) {
        return leftSpecificity - rightSpecificity;
      }

      return left.index - right.index;
    });

  return matchingChildOptions[0]?.option ?? requestedOption;
}
