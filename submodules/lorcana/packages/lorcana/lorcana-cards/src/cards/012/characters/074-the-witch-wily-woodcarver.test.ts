import { describe, expect, it } from "bun:test";
import {
  createMockCharacter,
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/lorcana-engine/testing";
import { theWitchWilyWoodcarver } from "./074-the-witch-wily-woodcarver";

const attacker = createMockCharacter({
  id: "the-witch-attacker",
  name: "Attacker",
  cost: 3,
  strength: 3,
  willpower: 5,
  lore: 1,
});

const defender = createMockCharacter({
  id: "the-witch-defender",
  name: "Defender",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

describe("The Witch - Wily Woodcarver", () => {
  describe("UNSATISFIED CUSTOMERS: Whenever this character is challenged, each opponent loses 1 lore.", () => {
    it("triggers when challenged — each opponent loses 1 lore", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: attacker, isDrying: false }],
          lore: 3,
          deck: 1,
        },
        {
          play: [{ card: theWitchWilyWoodcarver, exerted: true }],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(attacker, theWitchWilyWoodcarver),
      ).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerTwo().getBagEffects();
      expect(bagEffects.length).toBeGreaterThan(0);

      expect(
        testEngine.asPlayerTwo().resolvePendingByCard(theWitchWilyWoodcarver),
      ).toBeSuccessfulCommand();

      // Player one (the only opponent) should have lost 1 lore
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(2);
      // Player two (the Witch's controller) should not have lost lore
      expect(testEngine.asPlayerTwo().getLore(PLAYER_TWO)).toBe(0);
    });

    it("does not trigger when The Witch is the attacker", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: defender, exerted: true }],
          lore: 3,
          deck: 2,
        },
        {
          play: [{ card: theWitchWilyWoodcarver, isDrying: false }],
          deck: 2,
        },
      );

      // Pass turn so player two can challenge
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // The Witch challenges (attacks); she is not being challenged here.
      expect(
        testEngine.asPlayerTwo().challenge(theWitchWilyWoodcarver, defender),
      ).toBeSuccessfulCommand();

      // The trigger should NOT fire
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);

      // Player one's lore should remain unchanged
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(3);
    });
  });
});
