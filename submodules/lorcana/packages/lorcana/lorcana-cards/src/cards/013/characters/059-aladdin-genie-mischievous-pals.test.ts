import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { aladdinGenieMischievousPals } from "./059-aladdin-genie-mischievous-pals";

const aladdinShiftBase = createMockCharacter({
  id: "aladdin-genie-mischievous-pals-shift-base",
  name: "Aladdin",
  cost: 2,
});

const bottomCardOne = createMockCharacter({
  id: "aladdin-genie-mischievous-pals-bottom-one",
  name: "Bottom One",
  cost: 1,
});

const bottomCardTwo = createMockCharacter({
  id: "aladdin-genie-mischievous-pals-bottom-two",
  name: "Bottom Two",
  cost: 1,
});

const drawnCards = Array.from({ length: 3 }, (_, index) =>
  createMockCharacter({
    id: `aladdin-genie-mischievous-pals-drawn-${index + 1}`,
    name: `Drawn ${index + 1}`,
    cost: 1,
  }),
);

describe("Aladdin & Genie - Mischievous Pals", () => {
  it("can shift onto a character named Aladdin", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [aladdinGenieMischievousPals],
      inkwell: 3,
      play: [aladdinShiftBase],
    });

    const shiftTarget = testEngine.findCardInstanceId(aladdinShiftBase, "play", "player_one");

    expect(
      testEngine.asPlayerOne().playCard(aladdinGenieMischievousPals, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(aladdinGenieMischievousPals)).toBe("play");
  });

  it("puts selected hand cards on the bottom of the deck and draws that many plus one", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [aladdinGenieMischievousPals, bottomCardOne, bottomCardTwo],
      inkwell: aladdinGenieMischievousPals.cost,
      deck: drawnCards,
    });

    expect(testEngine.asPlayerOne().playCard(aladdinGenieMischievousPals)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(aladdinGenieMischievousPals, {
        resolveOptional: true,
        targets: [bottomCardOne, bottomCardTwo],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(bottomCardOne)).toBe("deck");
    expect(testEngine.asPlayerOne().getCardZone(bottomCardTwo)).toBe("deck");
    for (const card of drawnCards) {
      expect(testEngine.asPlayerOne().getCardZone(card)).toBe("hand");
    }
  });
});
