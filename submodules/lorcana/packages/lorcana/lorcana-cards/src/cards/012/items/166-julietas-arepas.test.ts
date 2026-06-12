import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { isabelaMadrigalPerfectlyInControl } from "../characters/153-isabela-madrigal-perfectly-in-control";
import { julietasArepas } from "./166-julietas-arepas";

const madrigalAlly = createMockCharacter({
  id: "julietas-arepas-madrigal-ally",
  name: "Madrigal Ally",
  cost: 2,
  willpower: 5,
  classifications: ["Storyborn", "Madrigal"],
});

const nonMadrigalAlly = createMockCharacter({
  id: "julietas-arepas-non-madrigal",
  name: "Non-Madrigal Ally",
  cost: 2,
  willpower: 5,
  classifications: ["Storyborn", "Hero"],
});

const damagedAlly = createMockCharacter({
  id: "julietas-arepas-damaged-ally",
  name: "Damaged Ally",
  cost: 2,
  willpower: 5,
});

describe("Julieta's Arepas", () => {
  describe("FLAVORFUL CURE - At the start of your turn, if you have a Madrigal character in play, remove up to 2 damage from chosen character.", () => {
    it("triggers at the start of your turn when you have a Madrigal character and removes up to 2 damage", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [julietasArepas, madrigalAlly, { card: damagedAlly, damage: 3 }],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(julietasArepas, {
          targets: [damagedAlly],
          amount: 2,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).toHaveDamage({ card: damagedAlly, value: 1 });
    });

    it("does not remove damage when you do not have a Madrigal character in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [julietasArepas, nonMadrigalAlly, { card: damagedAlly, damage: 3 }],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      expect(testEngine.asPlayerOne()).toHaveDamage({ card: damagedAlly, value: 3 });
    });
  });

  describe("THAT DID THE TRICK - {E} — If you removed damage from a character this turn, gain 1 lore.", () => {
    it("gains 1 lore when activated after damage was removed this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [julietasArepas, madrigalAlly, { card: damagedAlly, damage: 3 }],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      // Start of turn: FLAVORFUL CURE removes damage — enables THAT DID THE TRICK condition.
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(julietasArepas, {
          targets: [damagedAlly],
          amount: 2,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);

      expect(
        testEngine.asPlayerOne().activateAbility(julietasArepas, {
          ability: "THAT DID THE TRICK",
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(1);
    });

    it("does not gain lore when no damage was removed this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [julietasArepas, nonMadrigalAlly],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // Drain any pending start-of-turn bag entries before activating.
      if (testEngine.asPlayerOne().getBagCount() > 0) {
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(julietasArepas),
        ).toBeSuccessfulCommand();
      }

      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);

      // Activation should still be possible (condition checked on gain-lore, not on the ability's use).
      // Activation succeeds syntactically; gaining lore depends on the condition.
      testEngine.asPlayerOne().activateAbility(julietasArepas, {
        ability: "THAT DID THE TRICK",
      });

      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
    });
  });

  describe("release notes ruling", () => {
    it("That Did the Trick gains lore when damage was MOVED earlier this turn (moving counts as removing)", () => {
      // Q&A: Moving damage counts as removing damage; That Did the Trick
      // checks "If you removed damage from a character this turn".
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            julietasArepas,
            { card: isabelaMadrigalPerfectlyInControl, isDrying: false },
            { card: damagedAlly, damage: 3 },
          ],
          deck: 2,
        },
        { deck: 2 },
      );

      // Move damage from damagedAlly to Isabela-PIC by questing.
      expect(
        testEngine.asPlayerOne().quest(isabelaMadrigalPerfectlyInControl),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(isabelaMadrigalPerfectlyInControl, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [damagedAlly] }),
      ).toBeSuccessfulCommand();

      // Drain any unrelated bag triggers.
      while (testEngine.asPlayerOne().getBagCount() > 0) {
        testEngine.asPlayerOne().resolveAllBagEffects();
      }

      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(
        isabelaMadrigalPerfectlyInControl.lore,
      );

      const loreBefore = testEngine.asPlayerOne().getLore(PLAYER_ONE);
      expect(
        testEngine.asPlayerOne().activateAbility(julietasArepas, {
          ability: "THAT DID THE TRICK",
        }),
      ).toBeSuccessfulCommand();

      // +1 lore from That Did the Trick (damage was "removed" via move earlier).
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(loreBefore + 1);
    });
  });
});
