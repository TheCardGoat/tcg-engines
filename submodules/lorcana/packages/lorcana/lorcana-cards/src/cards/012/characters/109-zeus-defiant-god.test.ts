import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { zeusDefiantGod } from "./109-zeus-defiant-god";

describe("Zeus - Defiant God", () => {
  it("IMMORTAL WOUND - enters play with 4 damage", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [zeusDefiantGod],
      inkwell: zeusDefiantGod.cost,
    });

    expect(testEngine.asPlayerOne().playCard(zeusDefiantGod)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCard(zeusDefiantGod)?.damage).toBe(4);
  });

  it("remains in play because willpower (5) is greater than damage (4)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [zeusDefiantGod],
      inkwell: zeusDefiantGod.cost,
    });

    expect(testEngine.asPlayerOne().playCard(zeusDefiantGod)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(zeusDefiantGod)).toBe("play");
  });
});
