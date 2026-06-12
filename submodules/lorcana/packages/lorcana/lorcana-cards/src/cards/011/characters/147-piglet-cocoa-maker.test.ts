import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { pigletCocoaMaker } from "./147-piglet-cocoa-maker";

const damagedAlly = createMockCharacter({
  id: "piglet-damaged-ally",
  name: "Damaged Ally",
  cost: 2,
  willpower: 5,
});

const heavilyDamagedAlly = createMockCharacter({
  id: "piglet-heavily-damaged-ally",
  name: "Heavily Damaged Ally",
  cost: 3,
  willpower: 6,
});

describe("Piglet - Cocoa Maker", () => {
  it("has Shift 3 keyword", () => {
    const testEngine = new LorcanaTestEngine({
      play: [pigletCocoaMaker],
    });

    const cardUnderTest = testEngine.getCardModel(pigletCocoaMaker);
    expect(cardUnderTest.hasShift()).toBe(true);
    expect(cardUnderTest.shiftInkCost).toBe(3);
  });

  it("SPECIAL RECIPE - removes up to 2 damage from each character at end of turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        pigletCocoaMaker,
        { card: damagedAlly, damage: 3 },
        { card: heavilyDamagedAlly, damage: 4 },
      ],
      deck: 2,
    });

    // Verify initial damage
    expect(testEngine.asPlayerOne().getDamage(damagedAlly)).toBe(3);
    expect(testEngine.asPlayerOne().getDamage(heavilyDamagedAlly)).toBe(4);

    // Pass turn to trigger end-of-turn effect
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    // Resolve the SPECIAL RECIPE bag effect
    if (testEngine.asPlayerOne().getBagCount() > 0) {
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(pigletCocoaMaker),
      ).toBeSuccessfulCommand();
    }

    // Each character should have 2 less damage (up to 2 removed)
    expect(testEngine.asPlayerOne().getDamage(damagedAlly)).toBe(1);
    expect(testEngine.asPlayerOne().getDamage(heavilyDamagedAlly)).toBe(2);
  });

  it("SPECIAL RECIPE - does not remove more damage than character has", () => {
    const slightlyDamagedAlly = createMockCharacter({
      id: "piglet-slightly-damaged",
      name: "Slightly Damaged Ally",
      cost: 2,
      willpower: 4,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [pigletCocoaMaker, { card: slightlyDamagedAlly, damage: 1 }],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().getDamage(slightlyDamagedAlly)).toBe(1);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    if (testEngine.asPlayerOne().getBagCount() > 0) {
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(pigletCocoaMaker),
      ).toBeSuccessfulCommand();
    }

    // Character only had 1 damage, so all of it should be removed (not go negative)
    expect(testEngine.asPlayerOne().getDamage(slightlyDamagedAlly)).toBe(0);
  });
});
