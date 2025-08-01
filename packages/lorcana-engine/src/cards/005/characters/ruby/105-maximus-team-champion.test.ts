/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  gastonPureParagon,
  maximusTeamChampion,
  scroogeMcduckAficionadoOfAntiquities,
} from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Maximus - Team Champion", () => {
  describe("**A REWARD WORTHY OF A KING** At the end of your turn, if you have a character in play with 5 {S} or more, gain 2 lore. If that character has 10 {S} or more, gain 5 lore instead.", () => {
    it("No characters 5 strength on more in play", () => {
      const testStore = new TestStore(
        {
          play: [maximusTeamChampion],
        },
        {
          deck: 1,
        },
      );

      testStore.passTurn();

      expect(testStore.getPlayerLore("player_one")).toEqual(0);
    });

    it("With char with 5 or more strength", () => {
      const testStore = new TestStore(
        {
          play: [maximusTeamChampion, scroogeMcduckAficionadoOfAntiquities],
        },
        {
          deck: 1,
        },
      );

      testStore.passTurn();

      expect(testStore.getPlayerLore("player_one")).toEqual(2);
    });

    it("With char with 10 or more strength", () => {
      const testEngine = new TestEngine(
        {
          play: [maximusTeamChampion, gastonPureParagon],
        },
        {
          deck: 1,
        },
      );

      testEngine.passTurn();
      testEngine.changeActivePlayer("player_one");
      testEngine.acceptOptionalLayerBySource({ source: maximusTeamChampion });
      testEngine.acceptOptionalLayerBySource({ source: maximusTeamChampion });

      expect(testEngine.getPlayerLore("player_one")).toEqual(5);
    });
  });
});
