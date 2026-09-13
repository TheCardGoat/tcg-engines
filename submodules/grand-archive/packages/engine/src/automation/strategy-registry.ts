import {
  deterministicRandomGrandArchiveStrategy,
  firstLegalGrandArchiveStrategy,
  passOnlyGrandArchiveStrategy,
  type GrandArchiveBotStrategy,
} from "./bot-strategies.ts";
import {
  championProfileGrandArchiveStrategy,
  valueExtractGrandArchiveStrategy,
} from "./heuristic/index.ts";

interface GrandArchiveAutomatedActionStrategyOptionBase {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly strategy: GrandArchiveBotStrategy;
  /** Hidden from ordinary player-facing strategy pickers when true. */
  readonly testOnly?: boolean;
}

export type GrandArchiveAutomatedActionStrategyOption =
  | (GrandArchiveAutomatedActionStrategyOptionBase & {
      readonly scope: "generic";
    })
  | (GrandArchiveAutomatedActionStrategyOptionBase & {
      readonly scope: "champion";
      readonly championMatch: (identity: {
        readonly name: string;
        readonly canonicalId: string;
      }) => boolean;
    })
  | (GrandArchiveAutomatedActionStrategyOptionBase & {
      readonly scope: "dispatcher";
    });

export const DEFAULT_GRAND_ARCHIVE_AUTOMATED_ACTION_STRATEGY_ID = "champion-profile";

export const GRAND_ARCHIVE_AUTOMATED_ACTION_STRATEGIES = [
  {
    id: "champion-profile",
    label: "Champion profile",
    description:
      "Uses the seated champion's registered policy and falls back to generic value extraction.",
    strategy: championProfileGrandArchiveStrategy,
    scope: "dispatcher",
  },
  {
    id: "value-extract",
    label: "Value extract",
    description:
      "Ranks authoritative legal commands using current card characteristics and board state.",
    strategy: valueExtractGrandArchiveStrategy,
    scope: "generic",
  },
  {
    id: "first-legal",
    label: "First legal",
    description:
      "Deterministically prefers required decisions and progressing actions before passing.",
    strategy: firstLegalGrandArchiveStrategy,
    scope: "generic",
    testOnly: true,
  },
  {
    id: "pass-only",
    label: "Pass only",
    description:
      "Answers required decisions, then prefers passing, skipping materialization, and completing pregame actions.",
    strategy: passOnlyGrandArchiveStrategy,
    scope: "generic",
    testOnly: true,
  },
  {
    id: "random",
    label: "Deterministic random",
    description:
      "Chooses repeatably from authoritative legal commands using the match state and acting player.",
    strategy: deterministicRandomGrandArchiveStrategy,
    scope: "generic",
    testOnly: true,
  },
] as const satisfies readonly GrandArchiveAutomatedActionStrategyOption[];

export type GrandArchiveAutomatedActionStrategyId =
  (typeof GRAND_ARCHIVE_AUTOMATED_ACTION_STRATEGIES)[number]["id"];

export function getGrandArchiveAutomatedActionStrategyOption(
  strategyId: string,
): (typeof GRAND_ARCHIVE_AUTOMATED_ACTION_STRATEGIES)[number] | undefined {
  return GRAND_ARCHIVE_AUTOMATED_ACTION_STRATEGIES.find((option) => option.id === strategyId);
}

export function resolveGrandArchiveAutomatedActionStrategyOption(
  strategyId: string | null | undefined,
  defaultStrategyId: string = DEFAULT_GRAND_ARCHIVE_AUTOMATED_ACTION_STRATEGY_ID,
): (typeof GRAND_ARCHIVE_AUTOMATED_ACTION_STRATEGIES)[number] {
  return (
    (strategyId ? getGrandArchiveAutomatedActionStrategyOption(strategyId) : undefined) ??
    getGrandArchiveAutomatedActionStrategyOption(defaultStrategyId) ??
    GRAND_ARCHIVE_AUTOMATED_ACTION_STRATEGIES[0]
  );
}

export function getSafeGrandArchiveAutomatedActionStrategyOption(
  strategyId?: string | null,
): (typeof GRAND_ARCHIVE_AUTOMATED_ACTION_STRATEGIES)[number] {
  return resolveGrandArchiveAutomatedActionStrategyOption(
    strategyId,
    DEFAULT_GRAND_ARCHIVE_AUTOMATED_ACTION_STRATEGY_ID,
  );
}
