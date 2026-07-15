import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { madameMedusaDiamondLover } from "./053-madame-medusa-diamond-lover";

const alliedCharacter = createMockCharacter({
  id: "madame-medusa-diamond-lover-allied",
  name: "Allied Character",
  cost: 2,
  strength: 2,
  willpower: 6,
  lore: 1,
});

function resolveSearchTheSwamp(
  target: typeof alliedCharacter | typeof madameMedusaDiamondLover,
  playerTarget: typeof PLAYER_ONE | typeof PLAYER_TWO,
) {
  return {
    resolveOptional: true as const,
    targets: [target],
    playerTargets: playerTarget,
  };
}

describe("Madame Medusa - Diamond Lover", () => {
  describe("SEARCH THE SWAMP - Whenever this character quests, you may deal 2 damage to another chosen character of yours to put the top 3 cards of chosen player's deck into their discard.", () => {
    it("deals 2 damage to another friendly character and mills 3 cards from chosen player's deck when accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [madameMedusaDiamondLover, alliedCharacter],
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().quest(madameMedusaDiamondLover)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(madameMedusaDiamondLover, {
          ...resolveSearchTheSwamp(alliedCharacter, PLAYER_TWO),
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardByInstance(alliedCharacter).damage).toBe(2);
      expect(testEngine.asPlayerTwo().getZonesCardCount().deck).toBe(2);
      expect(testEngine.asPlayerTwo().getZonesCardCount().discard).toBe(3);
    });

    it("can target own deck to mill own cards", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [madameMedusaDiamondLover, alliedCharacter],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().quest(madameMedusaDiamondLover)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(
            madameMedusaDiamondLover,
            resolveSearchTheSwamp(alliedCharacter, PLAYER_ONE),
          ),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardByInstance(alliedCharacter).damage).toBe(2);
      expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(2);
      expect(testEngine.asPlayerOne().getZonesCardCount().discard).toBe(3);
    });

    it("does nothing when the optional ability is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [madameMedusaDiamondLover, alliedCharacter],
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().quest(madameMedusaDiamondLover)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(madameMedusaDiamondLover, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardByInstance(alliedCharacter).damage).toBe(0);
      expect(testEngine.asPlayerTwo().getZonesCardCount().deck).toBe(5);
      expect(testEngine.asPlayerTwo().getZonesCardCount().discard).toBe(0);
    });

    it("triggers each time Madame Medusa quests", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [madameMedusaDiamondLover, alliedCharacter],
          deck: 10,
        },
        {
          deck: 10,
        },
      );

      expect(testEngine.asPlayerOne().quest(madameMedusaDiamondLover)).toBeSuccessfulCommand();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(
            madameMedusaDiamondLover,
            resolveSearchTheSwamp(alliedCharacter, PLAYER_TWO),
          ),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardByInstance(alliedCharacter).damage).toBe(2);
      expect(testEngine.asPlayerTwo().getZonesCardCount().discard).toBe(3);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().quest(madameMedusaDiamondLover)).toBeSuccessfulCommand();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(
            madameMedusaDiamondLover,
            resolveSearchTheSwamp(alliedCharacter, PLAYER_TWO),
          ),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardByInstance(alliedCharacter).damage).toBe(4);
      expect(testEngine.asPlayerTwo().getZonesCardCount().discard).toBe(6);
    });
  });

  describe("Stats and basic properties", () => {
    it("should have correct stats", () => {
      expect(madameMedusaDiamondLover.cost).toBe(4);
      expect(madameMedusaDiamondLover.strength).toBe(3);
      expect(madameMedusaDiamondLover.willpower).toBe(4);
      expect(madameMedusaDiamondLover.lore).toBe(1);
    });

    it("should be inkable", () => {
      expect(madameMedusaDiamondLover.inkable).toBe(true);
    });

    it("should be amethyst and ruby dual ink", () => {
      expect(madameMedusaDiamondLover.inkType).toEqual(["amethyst", "ruby"]);
    });

    it("should be uncommon rarity", () => {
      expect(madameMedusaDiamondLover.rarity).toBe("uncommon");
    });

    it("should be from set 007", () => {
      expect(madameMedusaDiamondLover.set).toBe("007");
    });

    it("should be card number 53", () => {
      expect(madameMedusaDiamondLover.cardNumber).toBe(53);
    });
  });
});
