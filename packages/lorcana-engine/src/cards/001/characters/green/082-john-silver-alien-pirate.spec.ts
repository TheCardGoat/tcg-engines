/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  johnSilverAlienPirate,
  pascalRapunzelCompanion,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("John Silver - Alien Pirate", () => {
  describe("Pick Your Fights - When you play this character and whenever he quests, chosen opposing character gains **Reckless** during their next turn.", () => {
    it("On play", () => {
      const testStore = new TestStore(
        {
          deck: 2,
          inkwell: johnSilverAlienPirate.cost,
          hand: [johnSilverAlienPirate],
        },
        {
          deck: 2,
          play: [pascalRapunzelCompanion],
        },
      );

      const cardUnderTest = testStore.getByZoneAndId(
        "hand",
        johnSilverAlienPirate.id,
      );
      const target = testStore.getByZoneAndId(
        "play",
        pascalRapunzelCompanion.id,
        "player_two",
      );

      cardUnderTest.playFromHand();
      testStore.resolveTopOfStack({ targetId: target.instanceId });

      // Character gets "Reckless" on their turn
      expect(target.hasReckless).toBeFalsy();
      testStore.passTurn();
      expect(target.hasReckless).toBeTruthy();

      // Character loses "Reckless" when they pass their turn
      testStore.passTurn();
      expect(target.hasReckless).toBeFalsy();
    });

    it("On quest", () => {
      const testStore = new TestStore(
        {
          deck: 2,
          inkwell: johnSilverAlienPirate.cost,
          play: [johnSilverAlienPirate],
        },
        {
          deck: 2,
          play: [pascalRapunzelCompanion],
        },
      );

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        johnSilverAlienPirate.id,
      );
      const target = testStore.getByZoneAndId(
        "play",
        pascalRapunzelCompanion.id,
        "player_two",
      );

      cardUnderTest.quest();
      testStore.resolveTopOfStack({ targetId: target.instanceId });

      // Character gets "Reckless" on their turn
      expect(target.hasReckless).toBeFalsy();
      testStore.passTurn();
      expect(target.hasReckless).toBeTruthy();
    });
  });
});
