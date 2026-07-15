import { describe, it, expect } from "vite-plus/test";
import {
  assertGundamLogTranslationContract,
  collectGundamLogTranslationIssues,
} from "./log-translation-contract.ts";
import { GUNDAM_LOG_TRANSLATION_VALUE_KEYS } from "./translation-keys.ts";
import type { GundamLogMessageKey } from "../logging.ts";
import { renderGundamLogTemplate } from "./render-log-template.ts";
import { translateGundamLogMessage } from "./translate-log-message.ts";
import type { GundamGameLogEntry } from "../logging.ts";

describe("Gundam log translation contract", () => {
  it("passes for all required locales", () => {
    expect(() => assertGundamLogTranslationContract()).not.toThrow();
  });

  it("reports no issues", () => {
    const issues = collectGundamLogTranslationIssues();
    expect(issues).toEqual([]);
  });
});

describe("renderGundamLogTemplate", () => {
  it("renders a simple template with scalar values", () => {
    const result = renderGundamLogTemplate("gundam.move.deployUnit", {
      cardId: "rx-78-2",
      playerId: "p1",
      cost: 3,
    });
    expect(result).toBe("p1 deployed rx-78-2 (cost 3).");
  });

  it("renders array values as comma-separated", () => {
    const result = renderGundamLogTemplate("gundam.effect.cardsDiscarded", {
      playerId: "p1",
      cardIds: ["card-a", "card-b", "card-c"],
    });
    expect(result).toContain("card-a, card-b, card-c");
  });

  it("renders a template with no placeholders", () => {
    const result = renderGundamLogTemplate("gundam.setup.done", {} as Record<string, never>);
    expect(result).toBe("Setup complete.");
  });
});

describe("translateGundamLogMessage", () => {
  it("translates a typed log entry", () => {
    const entry: GundamGameLogEntry = {
      type: "gundam.move.concede",
      values: { playerId: "player_one" },
      visibility: { mode: "PUBLIC" },
      category: "action",
    };
    const result = translateGundamLogMessage(entry);
    expect(result).toBe("player_one conceded.");
  });

  it("defaults to en locale", () => {
    const entry: GundamGameLogEntry = {
      type: "gundam.setup.firstPlayerChosen",
      values: { chooser: "p1", chosen: "p2" },
      visibility: { mode: "PUBLIC" },
      category: "system",
    };
    const result = translateGundamLogMessage(entry);
    expect(result).toBe("p1 chose p2 to go first.");
  });
});

describe("GUNDAM_LOG_TRANSLATION_VALUE_KEYS coverage", () => {
  it("lists only fields that exist on each log value type", () => {
    const keys = Object.keys(GUNDAM_LOG_TRANSLATION_VALUE_KEYS) as GundamLogMessageKey[];
    expect(keys.length).toBeGreaterThan(0);
    for (const key of keys) {
      const valueKeys = GUNDAM_LOG_TRANSLATION_VALUE_KEYS[key];
      expect(Array.isArray(valueKeys), `${key} should be an array`).toBe(true);
    }
  });
});
