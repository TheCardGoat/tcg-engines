import { describe, expect, it, mock } from "bun:test";
import {
  BOARD_CONTROL_LORE_RACE_STRATEGY_ID,
  DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
} from "@tcg/lorcana-engine";
import {
  amberSteelGoofyLilo,
  steelSapphireAggressive,
  steelSapphireMidrange,
} from "../deck-fixtures/index.js";
import {
  prepareAutomatedMatchSimulation,
  replaceDeckTextWithFixture,
  simulateAutomatedMatch,
  type AutomatedMatchConfig,
  type AutomatedMatchStorage,
} from "./index.js";

class MemoryStorage implements AutomatedMatchStorage {
  #values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.#values.get(key) ?? null;
  }

  removeItem(key: string): void {
    this.#values.delete(key);
  }

  setItem(key: string, value: string): void {
    this.#values.set(key, value);
  }
}

function createConfig(): AutomatedMatchConfig {
  return {
    playerOneDeckText: steelSapphireMidrange.cards,
    playerTwoDeckText: steelSapphireAggressive.cards,
    playerOneFixtureId: steelSapphireMidrange.id,
    playerTwoFixtureId: steelSapphireAggressive.id,
    playerOneStrategyId: DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
    playerTwoStrategyId: BOARD_CONTROL_LORE_RACE_STRATEGY_ID,
    seed: "ai-match:seed",
  };
}

describe("automated match setup actions", () => {
  it("selecting a default fixture replaces the player deck text", () => {
    const nextConfig = replaceDeckTextWithFixture(
      createConfig(),
      "playerOne",
      amberSteelGoofyLilo.id,
    );

    expect(nextConfig.playerOneDeckText).toBe(amberSteelGoofyLilo.cards);
    expect(nextConfig.playerOneFixtureId).toBe(amberSteelGoofyLilo.id);
  });

  it("clicking simulate with valid decks prepares a new seeded config and navigates", async () => {
    const storage = new MemoryStorage();
    const navigate = mock(() => {});

    const result = await simulateAutomatedMatch({
      config: createConfig(),
      navigate,
      storage,
      viewerPath: "/sandbox/simulator/ai-match/viewer",
    });

    expect(result.nextConfig?.seed).not.toBe("ai-match:seed");
    expect(
      Object.values(result.errors).filter(
        (error): error is string => typeof error === "string" && error.trim().length > 0,
      ),
    ).toEqual([]);
    expect(navigate).toHaveBeenCalledWith("/sandbox/simulator/ai-match/viewer");
  });

  it("blocks simulate when validation fails", async () => {
    const config = createConfig();
    config.playerOneDeckText = "1 Definitely Not A Real Lorcana Card";

    const result = await prepareAutomatedMatchSimulation(config);

    expect(result.nextConfig).toBeUndefined();
    expect(result.errors.playerOneDeckText).toMatch(/unknown card name/i);
  });
});
