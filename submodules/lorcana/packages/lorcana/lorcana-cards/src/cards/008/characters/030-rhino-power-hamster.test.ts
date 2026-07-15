import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { rhinoPowerHamster } from "./030-rhino-power-hamster";

const opponentAttacker = createMockCharacter({
  id: "rhino-test-attacker",
  name: "Opponent Attacker",
  cost: 3,
  strength: 4,
  willpower: 4,
  lore: 1,
});

describe("Rhino - Power Hamster", () => {
  it("has Shift 2 keyword", () => {
    const shiftAbility = rhinoPowerHamster.abilities?.find(
      (a) => "keyword" in a && a.keyword === "Shift",
    );
    expect(shiftAbility).toBeDefined();
  });

  describe("EPIC BALL OF AWESOME - While this character has no damage, he gains Resist +2.", () => {
    it("should have Resist +2 when undamaged", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [rhinoPowerHamster],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().hasKeyword(rhinoPowerHamster, "Resist")).toBe(true);
      expect(testEngine.asPlayerOne().getKeywordValue(rhinoPowerHamster, "Resist")).toBe(2);
    });

    it("should NOT have Resist when damaged", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: rhinoPowerHamster, exerted: true }],
          deck: 5,
        },
        {
          play: [opponentAttacker],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().hasKeyword(rhinoPowerHamster, "Resist")).toBe(true);

      testEngine.asPlayerOne().passTurn();

      expect(
        testEngine.asPlayerTwo().challenge(opponentAttacker, rhinoPowerHamster),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(rhinoPowerHamster)).toBe(2);

      expect(testEngine.asPlayerOne().hasKeyword(rhinoPowerHamster, "Resist")).toBe(false);
    });

    it("should reduce damage by 2 when challenging while undamaged", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: rhinoPowerHamster, exerted: true }],
          deck: 5,
        },
        {
          play: [opponentAttacker],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().hasKeyword(rhinoPowerHamster, "Resist")).toBe(true);

      testEngine.asPlayerOne().passTurn();

      expect(
        testEngine.asPlayerTwo().challenge(opponentAttacker, rhinoPowerHamster),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(rhinoPowerHamster)).toBe(2);
      expect(testEngine.asPlayerOne().getCardZone(rhinoPowerHamster)).toBe("play");
    });
  });
});
