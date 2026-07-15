import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { healingGlow, mickeyMouseTrueFriend } from "../../001";
import { ursulasTrickery } from "./096-ursulas-trickery";

describe("Ursula's Trickery", () => {
  it("draws a card if the opponent declines to discard", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [ursulasTrickery],
        inkwell: ursulasTrickery.cost,
        deck: [healingGlow],
      },
      {
        hand: [mickeyMouseTrueFriend],
      },
    );

    expect(testEngine.asPlayerOne().playCard(ursulasTrickery).success).toBe(true);
    expect(testEngine.asPlayerTwo().resolveNextPending({ resolveOptional: false }).success).toBe(
      true,
    );

    expect(testEngine.asPlayerOne().getCardZone(healingGlow)).toBe("hand");
    expect(testEngine.asPlayerTwo().getCardZone(mickeyMouseTrueFriend)).toBe("hand");
  });

  it("does not draw if the opponent chooses and discards a card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [ursulasTrickery],
        inkwell: ursulasTrickery.cost,
      },
      {
        hand: [mickeyMouseTrueFriend],
      },
    );

    const discardId = testEngine.findCardInstanceId(mickeyMouseTrueFriend, "hand", "player_two");

    expect(testEngine.asPlayerOne().playCard(ursulasTrickery).success).toBe(true);
    expect(testEngine.asPlayerTwo().resolveNextPending({ resolveOptional: true }).success).toBe(
      true,
    );
    expect(testEngine.asPlayerTwo().resolveNextPending({ targets: [discardId] }).success).toBe(
      true,
    );

    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(0);
    expect(testEngine.asPlayerTwo().getCardZone(mickeyMouseTrueFriend)).toBe("discard");
  });
});
