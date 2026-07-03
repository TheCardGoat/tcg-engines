import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { fflewddurFflamLucklessBard } from "./038-fflewddur-fflam-luckless-bard";

const quester = createMockCharacter({
  id: "fflewddur-quester",
  name: "Quester",
  cost: 2,
  lore: 1,
});

const drawCard = createMockCharacter({
  id: "fflewddur-draw-card",
  name: "Draw Card",
  cost: 1,
});

describe("Fflewddur Fflam - Luckless Bard", () => {
  it("draws a card when played after one of your characters quested this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [fflewddurFflamLucklessBard],
      play: [{ card: quester, isDrying: false }],
      inkwell: fflewddurFflamLucklessBard.cost,
      deck: [drawCard],
    });

    expect(testEngine.asPlayerOne().quest(quester)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().playCard(fflewddurFflamLucklessBard)).toBeSuccessfulCommand();
    if (testEngine.asPlayerOne().getBagCount() > 0) {
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(fflewddurFflamLucklessBard),
      ).toBeSuccessfulCommand();
    }

    expect(testEngine.asPlayerOne().getCardZone(drawCard)).toBe("hand");
  });
});
