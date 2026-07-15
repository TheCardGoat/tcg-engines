import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { mickeyMouseTrueFriend } from "../../001/characters/012-mickey-mouse-true-friend";
import { hiddenTrap } from "./170-hidden-trap";
import { theThunderquack } from "./202-the-thunderquack";
import { theFrozenVineMonstrousPlant } from "../locations/068-the-frozen-vine-monstrous-plant";

const thunderquackAttacker = createMockCharacter({
  id: "the-thunderquack-attacker",
  name: "Thunderquack Attacker",
  cost: 2,
  strength: 5,
  willpower: 3,
});

const thunderquackDefender = createMockCharacter({
  id: "the-thunderquack-defender",
  name: "Thunderquack Defender",
  cost: 2,
  strength: 2,
  willpower: 2,
});

const strongThunderquackDefender = createMockCharacter({
  id: "the-thunderquack-strong-defender",
  name: "Thunderquack Strong Defender",
  cost: 4,
  strength: 5,
  willpower: 5,
});

describe("The Thunderquack", () => {
  describe("VIGILANTE JUSTICE - All opposing characters gain the Villain classification", () => {
    it("grants Villain classification to all opposing characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: theThunderquack.cost,
          hand: [theThunderquack],
        },
        {
          play: [mickeyMouseTrueFriend, thunderquackDefender],
        },
      );

      expect(testEngine.asPlayerOne().playCard(theThunderquack)).toBeSuccessfulCommand();

      expect(testEngine.getCard(mickeyMouseTrueFriend).classifications?.includes("Villain")).toBe(
        true,
      );
      expect(testEngine.getCard(thunderquackDefender).classifications?.includes("Villain")).toBe(
        true,
      );
    });

    it("does not grant Villain classification to your own characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: theThunderquack.cost,
          hand: [theThunderquack],
          play: [thunderquackAttacker],
        },
        {
          play: [mickeyMouseTrueFriend],
        },
      );

      expect(testEngine.asPlayerOne().playCard(theThunderquack)).toBeSuccessfulCommand();

      expect(testEngine.getCard(thunderquackAttacker).classifications?.includes("Villain")).toBe(
        false,
      );
    });

    it("removes Villain classification when The Thunderquack leaves play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [hiddenTrap],
          hand: [theThunderquack],
          inkwell: theThunderquack.cost,
        },
        {
          play: [mickeyMouseTrueFriend],
        },
      );

      expect(testEngine.asPlayerOne().playCard(theThunderquack)).toBeSuccessfulCommand();
      expect(testEngine.getCard(mickeyMouseTrueFriend).classifications?.includes("Villain")).toBe(
        true,
      );

      expect(
        testEngine.asPlayerOne().activateAbility(hiddenTrap, {
          choiceIndex: 0,
          targets: [theThunderquack],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(theThunderquack)).toBe("discard");
      expect(testEngine.getCard(mickeyMouseTrueFriend).classifications?.includes("Villain")).toBe(
        false,
      );
    });

    it("grants Villain classification to characters played after The Thunderquack", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: theThunderquack.cost,
          hand: [theThunderquack],
        },
        {
          inkwell: mickeyMouseTrueFriend.cost,
          hand: [mickeyMouseTrueFriend],
        },
      );

      expect(testEngine.asPlayerOne().playCard(theThunderquack)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().playCard(mickeyMouseTrueFriend)).toBeSuccessfulCommand();

      expect(testEngine.getCard(mickeyMouseTrueFriend).classifications?.includes("Villain")).toBe(
        true,
      );
    });
  });

  describe("LAY OF THE LAND - {E} If a character was banished in a challenge this turn, gain 1 lore", () => {
    it("gains 1 lore if an opposing character was banished in a challenge this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          deck: 2,
          play: [theThunderquack, thunderquackAttacker],
        },
        {
          deck: 2,
          play: [{ card: thunderquackDefender, exerted: true }],
        },
      );

      expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
      expect(
        testEngine.asPlayerOne().challenge(thunderquackAttacker, thunderquackDefender),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getCardZone(thunderquackDefender)).toBe("discard");
      expect(testEngine.asPlayerOne().activateAbility(theThunderquack)).toBeSuccessfulCommand();

      expect(testEngine.getLore(PLAYER_ONE)).toBe(1);
    });

    it("does not gain lore when no character was banished in a challenge this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [theThunderquack],
        },
        {
          play: [mickeyMouseTrueFriend],
        },
      );

      const result = testEngine.asPlayerOne().activateAbility(theThunderquack);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errorCode).toBe("ABILITY_CONDITION_NOT_MET");
      }
      expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
    });

    it("does not gain lore when only a location was banished in a challenge this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [theThunderquack, thunderquackAttacker],
        },
        {
          play: [{ card: theFrozenVineMonstrousPlant, exerted: true }],
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(thunderquackAttacker, theFrozenVineMonstrousPlant),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getCardZone(theFrozenVineMonstrousPlant)).toBe("discard");
      expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
    });

    it("does not gain lore when The Thunderquack is played after a challenge banish", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: theThunderquack.cost,
          hand: [theThunderquack],
          play: [thunderquackAttacker],
        },
        {
          play: [{ card: thunderquackDefender, exerted: true }],
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(thunderquackAttacker, thunderquackDefender),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getCardZone(thunderquackDefender)).toBe("discard");
      expect(testEngine.asPlayerOne().playCard(theThunderquack)).toBeSuccessfulCommand();

      expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
    });

    it("gains 1 lore if your own character was banished in a challenge this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [theThunderquack, thunderquackDefender],
        },
        {
          play: [{ card: strongThunderquackDefender, exerted: true }],
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(thunderquackDefender, strongThunderquackDefender),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(thunderquackDefender)).toBe("discard");
      expect(testEngine.asPlayerOne().activateAbility(theThunderquack)).toBeSuccessfulCommand();

      expect(testEngine.getLore(PLAYER_ONE)).toBe(1);
    });
  });
});
