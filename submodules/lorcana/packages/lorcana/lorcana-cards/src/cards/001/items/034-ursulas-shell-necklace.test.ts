import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { oneJumpAhead } from "../actions/164-one-jump-ahead";
import { ursulasShellNecklace } from "./034-ursulas-shell-necklace";

const inkedCard = createMockCharacter({
  id: "ursulas-shell-necklace-inked",
  name: "Inked Card",
  cost: 1,
});

const drawnCard = createMockCharacter({
  id: "ursulas-shell-necklace-drawn",
  name: "Drawn Card",
  cost: 1,
});

describe("Ursula's Shell Necklace (Set 1)", () => {
  it("lets you pay 1 ink after you play a song to draw a card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [oneJumpAhead],
      inkwell: oneJumpAhead.cost + 1,
      play: [ursulasShellNecklace],
      deck: [inkedCard, drawnCard],
    });

    expect(testEngine.asPlayerOne().playCard(oneJumpAhead)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(ursulasShellNecklace),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(inkedCard)).toBe("inkwell");
    expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");
    expect(testEngine.asPlayerOne().getZonesCardCount()).toEqual(
      expect.objectContaining({ hand: 1, deck: 0 }),
    );
  });

  it("does not draw if you cannot pay the extra ink", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [oneJumpAhead],
      inkwell: oneJumpAhead.cost,
      play: [ursulasShellNecklace],
      deck: [inkedCard, drawnCard],
    });

    expect(testEngine.asPlayerOne().playCard(oneJumpAhead)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerOne().getPendingEffects()).toEqual([]);

    expect(testEngine.asPlayerOne().getCardZone(inkedCard)).toBe("inkwell");
    expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("deck");
    expect(testEngine.asPlayerOne().getZonesCardCount()).toEqual(
      expect.objectContaining({ hand: 0, deck: 1 }),
    );
  });
});
