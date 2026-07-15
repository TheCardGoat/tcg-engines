import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { shift } from "../../../helpers/abilities/shift";
import { metamorphosis } from "./031-metamorphosis";

const shiftTarget = createMockCharacter({
  id: "metamorphosis-shift-target",
  name: "Shiftable Hero",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
});

const shiftableCharacter = createMockCharacter({
  id: "metamorphosis-shifter",
  name: "Shiftable Hero",
  version: "Upgraded",
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 2,
  abilities: [shift(3)],
});

const nonShiftCharacter = createMockCharacter({
  id: "metamorphosis-non-shift",
  name: "Non-Shift Character",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  abilities: [],
});

// Same name as `shiftTarget` so a regression that rejects Metamorphosis only
// because the base is missing wouldn't pass the release-notes-ruling test —
// a same-name in-play base IS available, the discard card just lacks Shift.
const nonShiftSameNameAsBase = createMockCharacter({
  id: "metamorphosis-non-shift-same-name",
  name: "Shiftable Hero",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  abilities: [],
});

describe("Metamorphosis", () => {
  it("does NOT offer non-Shift characters in discard as targets (BUG-11 regression)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [metamorphosis],
      inkwell: metamorphosis.cost,
      discard: [nonShiftCharacter],
    });

    // No valid targets — effect resolves without a pending selection
    expect(testEngine.asPlayerOne().playCard(metamorphosis)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(nonShiftCharacter)).toBe("discard");
    expect(testEngine.asPlayerOne()).toHavePendingEffectCount(0);
  });

  it("shifts a character from discard onto a matching in-play character for free", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [metamorphosis],
      inkwell: metamorphosis.cost,
      discard: [shiftableCharacter],
      play: [shiftTarget],
    });

    const playResult = testEngine.asPlayerOne().playCard(metamorphosis, {
      targets: [shiftableCharacter, shiftTarget],
    });

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(shiftableCharacter)).toBe("play");
    expect(testEngine.asPlayerOne()).toHaveZoneCounts({
      discard: 1,
      play: 1,
    });
  });

  describe("release notes ruling", () => {
    it("cannot resolve when no character with Shift is in discard, even with a same-name base in play", () => {
      // Q&A: A character must have the Shift keyword to be played by
      // Metamorphosis. Use a same-name pair (discard card and in-play base
      // share the name "Shiftable Hero") so the ONLY missing piece is the
      // Shift keyword — this rules out "no matching base" as the failure
      // reason and isolates the release-note ruling.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [metamorphosis],
        inkwell: metamorphosis.cost,
        discard: [nonShiftSameNameAsBase],
        play: [shiftTarget],
      });

      expect(testEngine.asPlayerOne().playCard(metamorphosis)).toBeSuccessfulCommand();

      // No valid shift target — the non-Shift card stays in discard, even
      // though a same-name in-play base exists.
      expect(testEngine.asPlayerOne().getCardZone(nonShiftSameNameAsBase)).toBe("discard");
      expect(testEngine.asPlayerOne()).toHavePendingEffectCount(0);
    });

    it("cannot resolve when no valid in-play shift base exists for the Shift character in discard", () => {
      // Q&A: Even if the discard contains a Shift character, you also need
      // an in-play character to shift it onto. With no base in play, the
      // effect should not move the Shift card into play.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [metamorphosis],
        inkwell: metamorphosis.cost,
        discard: [shiftableCharacter],
        // No matching base in play.
      });

      expect(testEngine.asPlayerOne().playCard(metamorphosis)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(shiftableCharacter)).toBe("discard");
    });
  });

  it("auto-selects the only valid shift base when no explicit shift target is provided", () => {
    // Regression for BUG-004: when there is exactly one legal in-play base for the
    // Shift character in discard, the effect should auto-select it rather than failing.
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [metamorphosis],
      inkwell: metamorphosis.cost,
      discard: [shiftableCharacter],
      play: [shiftTarget],
    });

    // No explicit targets — mirrors the real-game scenario where the player just
    // plays Metamorphosis without being asked to pick a separate shift target.
    const playResult = testEngine.asPlayerOne().playCard(metamorphosis, {
      targets: [shiftableCharacter],
    });

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(shiftableCharacter)).toBe("play");
    expect(testEngine.asPlayerOne()).toHaveZoneCounts({
      discard: 1,
      play: 1,
    });
  });
});
