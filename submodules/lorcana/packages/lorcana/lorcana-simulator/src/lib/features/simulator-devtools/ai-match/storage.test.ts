import { describe, expect, it } from "bun:test";
import {
  BOARD_CONTROL_LORE_RACE_STRATEGY_ID,
  DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
} from "@tcg/lorcana-engine";
import { DECK_FIXTURES } from "../deck-fixtures/index.js";
import {
  AUTOMATED_MATCH_STORAGE_KEY,
  loadAutomatedMatchConfig,
  readStoredAutomatedMatchConfig,
  saveAutomatedMatchConfig,
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

describe("automated match storage", () => {
  it("loads defaults from fixtures when storage is empty", () => {
    const storage = new MemoryStorage();
    const config = loadAutomatedMatchConfig(storage);

    expect(config.playerOneDeckText).toBe(DECK_FIXTURES[0]?.cards);
    expect(config.playerTwoDeckText).toBe(DECK_FIXTURES[1]?.cards ?? DECK_FIXTURES[0]?.cards);
    expect(config.playerOneStrategyId).toBe(DEFAULT_AUTOMATED_ACTION_STRATEGY_ID);
    expect(config.playerTwoStrategyId).toBe(DEFAULT_AUTOMATED_ACTION_STRATEGY_ID);
  });

  it("restores saved deck texts and strategy", () => {
    const storage = new MemoryStorage();
    const savedConfig = {
      playerOneDeckText: "1 Sail The Azurite Sea",
      playerTwoDeckText: "1 Grab Your Bow",
      playerOneFixtureId: "custom-one",
      playerTwoFixtureId: "custom-two",
      playerOneStrategyId: DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
      playerTwoStrategyId: BOARD_CONTROL_LORE_RACE_STRATEGY_ID,
      seed: "ai-match:123",
    };

    saveAutomatedMatchConfig(savedConfig, storage);

    expect(loadAutomatedMatchConfig(storage)).toEqual(savedConfig);
  });

  it("ignores malformed storage payloads", () => {
    const storage = new MemoryStorage();
    storage.setItem(AUTOMATED_MATCH_STORAGE_KEY, "{bad json");

    expect(readStoredAutomatedMatchConfig(storage)).toBeNull();
    expect(loadAutomatedMatchConfig(storage).playerOneDeckText).toBe(DECK_FIXTURES[0]?.cards);
  });

  it("falls back removed strategy ids to the current default", () => {
    const storage = new MemoryStorage();
    storage.setItem(
      AUTOMATED_MATCH_STORAGE_KEY,
      JSON.stringify({
        playerOneDeckText: "1 Sail The Azurite Sea",
        playerTwoDeckText: "1 Grab Your Bow",
        playerOneStrategyId: "default-lore-race",
        playerTwoStrategyId: BOARD_CONTROL_LORE_RACE_STRATEGY_ID,
        seed: "ai-match:stale-strategy",
      }),
    );

    expect(loadAutomatedMatchConfig(storage)).toMatchObject({
      playerOneStrategyId: DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
      playerTwoStrategyId: BOARD_CONTROL_LORE_RACE_STRATEGY_ID,
    });
  });
});
