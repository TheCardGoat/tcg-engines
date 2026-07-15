import { describe, expect, it } from "bun:test";
import {
  DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
  BOARD_CONTROL_LORE_RACE_STRATEGY_ID,
} from "@tcg/lorcana-engine";
import {
  HUMAN_VS_AI_STORAGE_KEY,
  loadHumanVsAiConfig,
  readStoredHumanVsAiConfig,
  type HumanVsAiStorage,
} from "./storage.js";

class MemoryStorage implements HumanVsAiStorage {
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

describe("human vs ai storage", () => {
  it("falls back removed strategy ids to the current default", () => {
    const storage = new MemoryStorage();
    storage.setItem(
      HUMAN_VS_AI_STORAGE_KEY,
      JSON.stringify({
        playerOneDeckText: "1 Sail The Azurite Sea",
        playerTwoDeckText: "1 Grab Your Bow",
        strategyId: "default-lore-race",
        seed: "vs-ai:stale-strategy",
      }),
    );

    expect(loadHumanVsAiConfig(storage)).toMatchObject({
      strategyId: DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
    });
  });

  it("preserves valid saved strategy ids", () => {
    const storage = new MemoryStorage();
    storage.setItem(
      HUMAN_VS_AI_STORAGE_KEY,
      JSON.stringify({
        playerOneDeckText: "1 Sail The Azurite Sea",
        playerTwoDeckText: "1 Grab Your Bow",
        strategyId: BOARD_CONTROL_LORE_RACE_STRATEGY_ID,
        seed: "vs-ai:valid-strategy",
      }),
    );

    expect(readStoredHumanVsAiConfig(storage)).toMatchObject({
      strategyId: BOARD_CONTROL_LORE_RACE_STRATEGY_ID,
    });
  });
});
