/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { goofyKnightForADay } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import { madameMedusaDiamondLover } from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
