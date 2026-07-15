import { describe, expect, it } from "bun:test";
import {
  AGGRESSIVE_BOARD_CONTROL_LORE_RACE_STRATEGY_ID,
  AUTOMATED_ACTION_STRATEGIES,
  BEST_DECK_AWARE_LORE_RACE_STRATEGY_ID,
  BEST_DECK_AWARE_ORACLE_LORE_RACE_STRATEGY_ID,
  BOARD_CONTROL_LORE_RACE_STRATEGY_ID,
  CHALLENGE_ONLY_TEST_STRATEGY_ID,
  DECK_AWARE_LORE_RACE_STRATEGY_ID,
  DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
  QUEST_ONLY_TEST_STRATEGY_ID,
  getAutomatedActionStrategyOption,
  getSafeAutomatedActionStrategyOption,
  resolveAutomatedActionStrategyOption,
} from "./strategy-registry";

describe("automated action strategy registry", () => {
  it("exports the current selectable engine strategies", () => {
    expect(AUTOMATED_ACTION_STRATEGIES.map((option) => option.id)).toEqual([
      DECK_AWARE_LORE_RACE_STRATEGY_ID,
      BEST_DECK_AWARE_LORE_RACE_STRATEGY_ID,
      BEST_DECK_AWARE_ORACLE_LORE_RACE_STRATEGY_ID,
      BOARD_CONTROL_LORE_RACE_STRATEGY_ID,
      AGGRESSIVE_BOARD_CONTROL_LORE_RACE_STRATEGY_ID,
      QUEST_ONLY_TEST_STRATEGY_ID,
      CHALLENGE_ONLY_TEST_STRATEGY_ID,
    ]);
  });

  it("uses unique strategy ids", () => {
    const ids = AUTOMATED_ACTION_STRATEGIES.map((option) => option.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it("resolves the default strategy id to a registry entry", () => {
    const defaultOption = getAutomatedActionStrategyOption(DEFAULT_AUTOMATED_ACTION_STRATEGY_ID);

    expect(defaultOption).toBeDefined();
    expect(defaultOption?.strategy.name).toBe(DECK_AWARE_LORE_RACE_STRATEGY_ID);
  });

  it("falls back to the default option when a saved strategy id no longer exists", () => {
    const strategyOption = getSafeAutomatedActionStrategyOption("default-lore-race");

    expect(strategyOption.id).toBe(DEFAULT_AUTOMATED_ACTION_STRATEGY_ID);
  });

  it("marks the test strategies as test-only while still resolving them by id", () => {
    const questOnlyOption = getSafeAutomatedActionStrategyOption(QUEST_ONLY_TEST_STRATEGY_ID);
    const challengeOnlyOption = getSafeAutomatedActionStrategyOption(
      CHALLENGE_ONLY_TEST_STRATEGY_ID,
    );

    expect(questOnlyOption.testOnly).toBe(true);
    expect(challengeOnlyOption.testOnly).toBe(true);
    expect(questOnlyOption.strategy.name).toBe(QUEST_ONLY_TEST_STRATEGY_ID);
    expect(challengeOnlyOption.strategy.name).toBe(CHALLENGE_ONLY_TEST_STRATEGY_ID);
  });

  it("resolves the default strategy id to the deck-aware strategy for supported color pairs", () => {
    const resolvedOption = resolveAutomatedActionStrategyOption({
      actorColorPairId: "sapphire-steel",
      strategyId: DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
    });

    expect(resolvedOption?.id).toBe(DECK_AWARE_LORE_RACE_STRATEGY_ID);
  });

  it("keeps the requested base strategy when no color-aware child matches", () => {
    const resolvedOption = resolveAutomatedActionStrategyOption({
      actorColorPairId: "amber-amethyst",
      strategyId: DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
    });

    expect(resolvedOption?.id).toBe(DECK_AWARE_LORE_RACE_STRATEGY_ID);
  });

  it("never auto-selects a test-only strategy when resolving the default strategy id", () => {
    const resolvedOption = resolveAutomatedActionStrategyOption({
      actorColorPairId: "sapphire-steel",
      strategyId: DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
    });

    expect(resolvedOption?.testOnly).not.toBe(true);
    expect(resolvedOption?.id).toBe(DECK_AWARE_LORE_RACE_STRATEGY_ID);
  });

  it("keeps an explicitly requested child strategy even when its color list does not match", () => {
    const resolvedOption = resolveAutomatedActionStrategyOption({
      actorColorPairId: "amber-amethyst",
      strategyId: DECK_AWARE_LORE_RACE_STRATEGY_ID,
    });

    expect(resolvedOption?.id).toBe(DECK_AWARE_LORE_RACE_STRATEGY_ID);
  });

  it("does not auto-upgrade the base deck-aware strategy into the best-ai candidates", () => {
    const resolvedOption = resolveAutomatedActionStrategyOption({
      actorColorPairId: "sapphire-steel",
      strategyId: DECK_AWARE_LORE_RACE_STRATEGY_ID,
    });

    expect(resolvedOption?.id).toBe(DECK_AWARE_LORE_RACE_STRATEGY_ID);
  });
});
