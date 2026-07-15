import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { cobraBubblesFormerCia } from "./188-cobra-bubbles-former-cia";

const drawnCard = createMockCharacter({
  id: "cobra-bubbles-former-cia-drawn-card",
  name: "Drawn Card",
  cost: 1,
});

const discardFodder = createMockCharacter({
  id: "cobra-bubbles-former-cia-discard-fodder",
  name: "Discard Fodder",
  cost: 1,
});

describe("Cobra Bubbles - Former CIA", () => {
  it("has Bodyguard", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [cobraBubblesFormerCia],
    });

    expect(testEngine.asPlayerOne().hasKeyword(cobraBubblesFormerCia, "Bodyguard")).toBe(true);
  });

  it("draws a card, then lets you choose and discard a card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [drawnCard],
      hand: [discardFodder],
      play: [cobraBubblesFormerCia],
    });

    const cobraId = testEngine.findCardInstanceId(cobraBubblesFormerCia, "play", "player_one");
    const discardId = testEngine.findCardInstanceId(discardFodder, "hand", "player_one");

    expect(
      testEngine.asPlayerOne().activateAbility(cobraId, "THINK ABOUT WHAT'S BEST 2"),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolveNextPending({
        targets: [discardId],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(discardFodder)).toBe("discard");
  });
});
