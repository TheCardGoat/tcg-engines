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
import currentPromotion from "./promotions/current.json" with { type: "json" };

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

  test("default surfaces the promotion it follows", () => {
    const promotedId = currentPromotion.promotedStrategyId;
    const defaultOption = getAutomatedActionStrategyOption("default");
    if (promotedId === "default") {
      expect(defaultOption?.label).toBe("Default");
      return;
    }
    const promoted = getAutomatedActionStrategyOption(promotedId);
    expect(promoted).toBeDefined();
    expect(defaultOption?.label).toBe(`Default (promoted: ${promoted?.label})`);
    expect(defaultOption?.description).toContain(promoted?.label ?? "");
  });

  test("default resolves to the promoted strategy", () => {
    expect(DEFAULT_AUTOMATED_ACTION_STRATEGY_ID).toBe(currentPromotion.promotedStrategyId);
    expect(getSafeAutomatedActionStrategyOption("default").id).toBe(
      currentPromotion.promotedStrategyId,
    );
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
