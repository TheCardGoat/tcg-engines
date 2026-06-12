import { describe, expect, it } from "bun:test";
import {
  AUTOMATED_ACTION_STRATEGIES,
  DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
} from "@tcg/lorcana-engine";
import { createDefaultAutomatedMatchConfig } from "./config.js";

describe("automated match config", () => {
  it("uses the engine default strategy id", () => {
    const config = createDefaultAutomatedMatchConfig();

    expect(config.playerOneStrategyId).toBe(DEFAULT_AUTOMATED_ACTION_STRATEGY_ID);
    expect(config.playerTwoStrategyId).toBe(DEFAULT_AUTOMATED_ACTION_STRATEGY_ID);
  });

  it("stays aligned with the engine strategy registry", () => {
    const config = createDefaultAutomatedMatchConfig();

    expect(
      AUTOMATED_ACTION_STRATEGIES.some(
        (strategyOption) =>
          strategyOption.id === config.playerOneStrategyId &&
          strategyOption.id === config.playerTwoStrategyId,
      ),
    ).toBe(true);
  });
});
