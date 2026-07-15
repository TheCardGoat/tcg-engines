import { describe, expect, it } from "bun:test";
import { createMockCharacter, LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { madamMimElephant } from "./044-madam-mim-elephant";
import { goofyKnightForADay } from "../../002";

const allyCharacter = createMockCharacter({
  id: "mim-elephant-ally",
  name: "Ally Character",
  cost: 2,
});

describe("Madam Mim - Elephant", () => {
  describe("A LITTLE GAME - When you play this character, banish her or return another chosen character of yours to your hand.", () => {
    it("choosing to banish her sends her to discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: madamMimElephant.cost,
        hand: [madamMimElephant],
        play: [allyCharacter],
      });

      expect(testEngine.asPlayerOne().playCard(madamMimElephant)).toBeSuccessfulCommand();

      testEngine.asPlayerOne().resolvePendingByCard(madamMimElephant);
      testEngine.asPlayerOne().resolveNextPending({ choiceIndex: 0 });

      expect(testEngine.asPlayerOne().getCardZone(madamMimElephant)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(allyCharacter)).toBe("play");
    });

    it("choosing to return another character sends it to hand and keeps Mim in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: madamMimElephant.cost,
        hand: [madamMimElephant],
        play: [allyCharacter],
      });

      expect(testEngine.asPlayerOne().playCard(madamMimElephant)).toBeSuccessfulCommand();

      testEngine.asPlayerOne().resolvePendingByCard(madamMimElephant);
      testEngine.asPlayerOne().resolveNextPending({ choiceIndex: 1, targets: [allyCharacter] });

      expect(testEngine.asPlayerOne().getCardZone(allyCharacter)).toBe("hand");
      expect(testEngine.asPlayerOne().getCardZone(madamMimElephant)).toBe("play");
    });
  });

  describe("SNEAKY MOVE - At the start of your turn, you may move up to 2 damage counters from this character to chosen opposing character.", () => {
    it("does not enter the bag when Madam Mim has no damage (phantom-trigger regression)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [goofyKnightForADay],
        },
        {
          play: [{ card: madamMimElephant, damage: 0 }],
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);
    });

    it("does not enter the bag when opponent has no characters (phantom-trigger regression)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {},
        {
          play: [{ card: madamMimElephant, damage: 1 }],
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);
    });

    it("moves 1 damage counter from Madam Mim to opposing character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [goofyKnightForADay],
        },
        {
          play: [{ card: madamMimElephant, damage: 1 }],
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getBagCount()).toBeGreaterThan(0);
      expect(
        testEngine.asPlayerTwo().resolvePendingByCard(madamMimElephant, {
          resolveOptional: true,
          targets: [goofyKnightForADay],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getDamage(madamMimElephant)).toBe(0);
      expect(testEngine.asPlayerOne().getDamage(goofyKnightForADay)).toBe(1);
    });

    it("projects the source slot as auto-resolved for the move-damage prompt", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [goofyKnightForADay],
        },
        {
          play: [{ card: madamMimElephant, damage: 1 }],
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      const selectionContext = testEngine.asPlayerTwo().getBoard().bagEffects[0]?.selectionContext;
      expect(selectionContext?.kind).toBe("target-selection");
      if (selectionContext?.kind !== "target-selection") {
        throw new Error("Expected target-selection");
      }
      expect(selectionContext.expectedSlottedKind).toBe("move-damage");
      expect(selectionContext.autoResolvedSlots).toEqual(["from"]);
      expect(selectionContext.minSelections).toBe(1);
      expect(selectionContext.maxSelections).toBe(1);
    });

    it("moves up to 2 damage counters from Madam Mim to opposing character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [goofyKnightForADay],
        },
        {
          play: [{ card: madamMimElephant, damage: 3 }],
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getBagCount()).toBeGreaterThan(0);
      expect(
        testEngine.asPlayerTwo().resolvePendingByCard(madamMimElephant, {
          resolveOptional: true,
          targets: [goofyKnightForADay],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getDamage(madamMimElephant)).toBe(1);
      expect(testEngine.asPlayerOne().getDamage(goofyKnightForADay)).toBe(2);
    });

    it("can decline the optional ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [goofyKnightForADay],
        },
        {
          play: [{ card: madamMimElephant, damage: 2 }],
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getBagCount()).toBeGreaterThan(0);
      expect(
        testEngine.asPlayerTwo().resolvePendingByCard(madamMimElephant, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getDamage(madamMimElephant)).toBe(2);
      expect(testEngine.asPlayerOne().getDamage(goofyKnightForADay)).toBe(0);
    });

    it("does not trigger when there is no damage on Madam Mim", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [goofyKnightForADay],
        },
        {
          play: [madamMimElephant],
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Trigger-level condition prevents phantom prompts when there's no damage to move.
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);
      expect(testEngine.asPlayerTwo().getDamage(madamMimElephant)).toBe(0);
      expect(testEngine.asPlayerOne().getDamage(goofyKnightForADay)).toBe(0);
    });

    it("does not trigger when there is no opposing character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {},
        {
          play: [{ card: madamMimElephant, damage: 2 }],
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Trigger-level condition prevents phantom prompts when there's no legal destination.
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);
      expect(testEngine.asPlayerTwo().getDamage(madamMimElephant)).toBe(2);
    });
  });

  it("regression: self-banishes when no other character of yours can be returned to hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: madamMimElephant.cost,
      hand: [madamMimElephant],
      // No other characters in play to return
    });

    expect(testEngine.asPlayerOne().playCard(madamMimElephant)).toBeSuccessfulCommand();

    // A LITTLE GAME triggers - must choose between banish self or return another character
    // Since there's no other character to return, the second option has no valid targets
    // So she must banish herself
    testEngine.asPlayerOne().resolvePendingByCard(madamMimElephant);
    testEngine.asPlayerOne().resolveNextPending({ choiceIndex: 0 });

    expect(testEngine.asPlayerOne().getCardZone(madamMimElephant)).toBe("discard");
  });
});
