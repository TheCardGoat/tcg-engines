import { describe, expect, test } from "vite-plus/test";
import {
  AUTOMATED_ACTION_STRATEGIES,
  DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
  buildAutomatedActionStrategyOptions,
  getAutomatedActionStrategyOption,
  getSafeAutomatedActionStrategyOption,
} from "./strategy-registry.ts";
import { boundDeckProfile, withDeckProfile } from "./bind-profile.ts";
import type { DeckStrategyProfile } from "./deck-profile.ts";

const TEST_PROFILE: DeckStrategyProfile = {
  deckId: "authored-test-deck",
  plan: "Test plan used to verify profile binding preserves identity.",
  coreCards: [],
};

describe("automated action strategy registry", () => {
  test("every option's strategy name matches its registry id", () => {
    for (const option of AUTOMATED_ACTION_STRATEGIES) {
      expect(option.strategy.name, option.id).toBe(option.id);
    }
  });

  test("Recommended discloses Expert and its hidden information access", () => {
    const recommended = getAutomatedActionStrategyOption("default");
    expect(recommended).toMatchObject({ label: "Recommended", informationPolicy: "oracle" });
    expect(recommended?.description).toContain("Expert (full information)");
    expect(recommended?.description).toContain(
      "Sees both hands, both decks in order, and face-down Legends",
    );
  });

  test("production strategies use player-facing labels", () => {
    expect(getAutomatedActionStrategyOption("default")?.label).toBe("Recommended");
    expect(getAutomatedActionStrategyOption("tactical")?.label).toBe("Sharp");
    expect(getAutomatedActionStrategyOption("tactical-ability-aware")?.label).toBe("Masterful");
  });

  test("bot games default to Expert while explicit public strategies remain available", () => {
    expect(DEFAULT_AUTOMATED_ACTION_STRATEGY_ID).toBe("expert-oracle");
    for (const requested of [undefined, null, "default", "does-not-exist"]) {
      const option = getSafeAutomatedActionStrategyOption(requested);
      expect(option.id).toBe("expert-oracle");
      expect(option.informationPolicy).toBe("oracle");
      expect(option.testOnly).not.toBe(true);
    }
    expect(getSafeAutomatedActionStrategyOption("tactical").informationPolicy).toBe("public");
    expect(getAutomatedActionStrategyOption("tactical")?.testOnly).not.toBe(true);
    expect(getAutomatedActionStrategyOption("first-legal")?.testOnly).toBe(true);
  });

  test("profile binding preserves the strategy name so seats stay identifiable", () => {
    const option = getSafeAutomatedActionStrategyOption("tactical");
    const bound = withDeckProfile(option.strategy, TEST_PROFILE);
    expect(bound).not.toBe(option.strategy);
    expect(bound.name).toBe(option.id);
    expect(boundDeckProfile(bound)).toBe(TEST_PROFILE);
    expect(boundDeckProfile(option.strategy)).toBeUndefined();
  });

  test("promoted reconstruction keeps names aligned with ids", () => {
    const options = buildAutomatedActionStrategyOptions({
      promotedStrategyId: "lab-greedy-v99",
      informationPolicy: "public",
      strategyConfig: {
        greedyWeights: {
          ownNearWinThreshold: 4,
          rivalNearWinThreshold: 4,
          mulliganMinCheapCards: 2,
          mulliganCheapCostThreshold: 2,
          mulliganMinSellable: 1,
          fightMinMargin: 0,
          defaultPriority: { playCard: 10 },
          ownNearWinPriority: { attackRival: 10 },
          rivalNearWinPriority: { attackUnit: 10 },
        },
      },
    });
    for (const option of options) {
      expect(option.strategy.name, option.id).toBe(option.id);
    }
    const promoted = options.find((option) => option.id === "lab-greedy-v99");
    expect(promoted?.label).toBe("lab-greedy-v99 (promoted)");
  });
});
