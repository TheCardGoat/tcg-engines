/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { madameMedusaDiamondLover } from "@lorcanito/lorcana-engine/cards/007";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Madame Medusa - Diamond Lover", () => {
  describe("SEARCH THE SWAMP Whenever this character quests, you may deal 2 damage to another chosen character of yours to put the top 3 cards of chosen player's deck into their discard.", () => {
    it("Milling opponent", async () => {
      const testEngine = new TestEngine(
        {
          deck: 10,
          play: [madameMedusaDiamondLover, goofyKnightForADay],
        },
        {
          deck: 10,
        },
      );

      await testEngine.questCard(madameMedusaDiamondLover);

      await testEngine.resolveOptionalAbility();
      await testEngine.resolveTopOfStack(
        {
          targets: [goofyKnightForADay],
        },
        true,
      );

      expect(testEngine.getCardModel(goofyKnightForADay).damage).toEqual(2);

      await testEngine.resolveTopOfStack({
        targetPlayer: "player_two",
      });

      expect(testEngine.getZonesCardCount("player_two")).toEqual(
        expect.objectContaining({
          discard: 3,
          deck: 7,
        }),
      );
      expect(testEngine.getZonesCardCount("player_one")).toEqual(
        expect.objectContaining({
          discard: 0,
          deck: 10,
        }),
      );
    });

    it("Milling yourself", async () => {
      const testEngine = new TestEngine(
        {
          deck: 10,
          play: [madameMedusaDiamondLover, goofyKnightForADay],
        },
        {
          deck: 10,
        },
      );

      await testEngine.questCard(madameMedusaDiamondLover);

      await testEngine.resolveOptionalAbility();
      await testEngine.resolveTopOfStack(
        {
          targets: [goofyKnightForADay],
        },
        true,
      );

      expect(testEngine.getCardModel(goofyKnightForADay).damage).toEqual(2);

      await testEngine.resolveTopOfStack({
        targetPlayer: "player_one",
      });

      expect(testEngine.getZonesCardCount("player_one")).toEqual(
        expect.objectContaining({
          discard: 3,
          deck: 7,
        }),
      );
      expect(testEngine.getZonesCardCount("player_two")).toEqual(
        expect.objectContaining({
          discard: 0,
          deck: 10,
        }),
      );
    });
  });
});
