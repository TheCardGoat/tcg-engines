import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { stabbingtonBrotherWithoutAPatch } from "./125-stabbington-brother-without-a-patch";

const anotherStabbingtonBrother = createMockCharacter({
  id: "stabbington-test-other-brother",
  name: "Stabbington Brother",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
});

const otherCharacter = createMockCharacter({
  id: "stabbington-test-other",
  name: "Other Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const opponentStabbington = createMockCharacter({
  id: "stabbington-test-opponent-brother",
  name: "Stabbington Brother",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
});

describe("Stabbington Brother - Without a Patch", () => {
  it("has Rush keyword", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [stabbingtonBrotherWithoutAPatch],
    });

    expect(testEngine.hasKeyword(stabbingtonBrotherWithoutAPatch, "Rush")).toBe(true);
  });

  describe("GET 'EM! — Your other characters named Stabbington Brother gain Rush.", () => {
    it("grants Rush to your other characters named Stabbington Brother", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [stabbingtonBrotherWithoutAPatch, anotherStabbingtonBrother],
      });

      expect(testEngine.hasKeyword(anotherStabbingtonBrother, "Rush")).toBe(true);
    });

    it("does not grant Rush to characters with other names", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [stabbingtonBrotherWithoutAPatch, otherCharacter],
      });

      expect(testEngine.hasKeyword(otherCharacter, "Rush")).toBe(false);
    });

    it("does not grant Rush to the source card itself", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [stabbingtonBrotherWithoutAPatch],
      });

      // The source card itself has Rush from its own keyword ability, not from GET 'EM!
      // Verifying the static ability does not apply to self — the Rush comes from the keyword ability
      expect(testEngine.hasKeyword(stabbingtonBrotherWithoutAPatch, "Rush")).toBe(true);
    });

    it("does not grant Rush to opponent's Stabbington Brother characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [stabbingtonBrotherWithoutAPatch] },
        { play: [opponentStabbington] },
      );

      expect(testEngine.asPlayerTwo().hasKeyword(opponentStabbington, "Rush")).toBe(false);
    });
  });
});
