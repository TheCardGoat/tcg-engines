import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { cheshireCatFromTheShadows } from "./075-cheshire-cat-from-the-shadows";

const damagedTarget = createMockCharacter({
  id: "cheshire-damaged-target",
  name: "Damaged Target",
  cost: 3,
  willpower: 4,
});

const undamagedTarget = createMockCharacter({
  id: "cheshire-undamaged-target",
  name: "Undamaged Target",
  cost: 3,
  willpower: 4,
});

describe("Cheshire Cat - From the Shadows", () => {
  it("has Shift 5 and Evasive", () => {
    const testEngine = new LorcanaTestEngine({
      play: [cheshireCatFromTheShadows],
    });

    const cardUnderTest = testEngine.getCardModel(cheshireCatFromTheShadows);
    expect(cardUnderTest.hasShift()).toBe(true);
    expect(cardUnderTest.shiftInkCost).toBe(5);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });

  it("can banish a chosen damaged character with its activated ability", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [cheshireCatFromTheShadows],
        deck: 1,
      },
      {
        play: [{ card: damagedTarget, damage: 1 }],
        deck: 1,
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(cheshireCatFromTheShadows, {
        targets: [damagedTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(damagedTarget)).toBe("discard");
    expect(testEngine.asPlayerOne().isExerted(cheshireCatFromTheShadows)).toBe(true);
  });

  it("cannot banish an undamaged character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [cheshireCatFromTheShadows],
        deck: 1,
      },
      {
        play: [undamagedTarget],
        deck: 1,
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(cheshireCatFromTheShadows, {
        targets: [undamagedTarget],
      }).success,
    ).toBe(false);

    expect(testEngine.asPlayerTwo().getCardZone(undamagedTarget)).toBe("play");
  });
});
