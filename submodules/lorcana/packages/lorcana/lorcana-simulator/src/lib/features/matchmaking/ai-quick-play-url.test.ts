import { describe, expect, it } from "bun:test";

import { buildAiQuickPlayUrl, encodeDeckTextForAiQuickPlay } from "./ai-quick-play-url.js";

describe("ai-quick-play-url", () => {
  it("encodes deck text as base64url", () => {
    expect(encodeDeckTextForAiQuickPlay("4 Simba - Protective Cub")).toBe(
      "NCBTaW1iYSAtIFByb3RlY3RpdmUgQ3Vi",
    );
  });

  it("builds the quick-play URL from deck text", () => {
    expect(buildAiQuickPlayUrl("4 Simba - Protective Cub")).toBe(
      "/sandbox/simulator/vs-ai/quick?deck=NCBTaW1iYSAtIFByb3RlY3RpdmUgQ3Vi",
    );
  });

  it("appends optional bot fixture and strategy params when provided", () => {
    expect(
      buildAiQuickPlayUrl({
        deckText: "4 Simba - Protective Cub",
        opponentFixtureId: "amber-amethyst-control",
        strategyId: "board-control-lore-race",
      }),
    ).toBe(
      "/sandbox/simulator/vs-ai/quick?deck=NCBTaW1iYSAtIFByb3RlY3RpdmUgQ3Vi&opponentFixtureId=amber-amethyst-control&strategyId=board-control-lore-race",
    );
  });

  it("encodes deck text containing non-latin1 characters without throwing", () => {
    expect(() => encodeDeckTextForAiQuickPlay("4 Héros - La Belle")).not.toThrow();
  });

  it("omits empty optional params", () => {
    expect(
      buildAiQuickPlayUrl({
        deckText: "4 Simba - Protective Cub",
        opponentFixtureId: " ",
        strategyId: "",
      }),
    ).toBe("/sandbox/simulator/vs-ai/quick?deck=NCBTaW1iYSAtIFByb3RlY3RpdmUgQ3Vi");
  });
});
