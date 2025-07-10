/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  caterpillarCalmAndCollected,
  hiramFlavershamToymaker,
  jasmineHeirOfAgrabah,
  queenOfHeartsSensingWeakness,
} from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Challenge trigger", () => {
  describe("Whenever one of your characters challenges another character", () => {
    it("triggers when your character challenges", () => {
      const testStore = new TestStore(
        {
          play: [
            queenOfHeartsSensingWeakness,
            caterpillarCalmAndCollected,
            jasmineHeirOfAgrabah,
          ],
        },
        {
          play: [hiramFlavershamToymaker],
        },
      );

      const defender = testStore.getByZoneAndId(
        "play",
        hiramFlavershamToymaker.id,
        "player_two",
      );
      defender.updateCardMeta({ exerted: true });

      const attackerOne = testStore.getByZoneAndId(
        "play",
        caterpillarCalmAndCollected.id,
      );
      const attackerTwo = testStore.getByZoneAndId(
        "play",
        jasmineHeirOfAgrabah.id,
      );

      attackerOne.challenge(defender);
      expect(testStore.stackLayers).toHaveLength(1);
      testStore.skipOptionalAbility();

      attackerTwo.challenge(defender);
      expect(testStore.stackLayers).toHaveLength(1);
      testStore.skipOptionalAbility();
    });

    it("DOES NOT trigger when your opponent's character challenges", () => {
      const testStore = new TestStore(
        {
          play: [caterpillarCalmAndCollected, jasmineHeirOfAgrabah],
        },
        {
          play: [queenOfHeartsSensingWeakness, hiramFlavershamToymaker],
        },
      );

      const defender = testStore.getByZoneAndId(
        "play",
        hiramFlavershamToymaker.id,
        "player_two",
      );
      defender.updateCardMeta({ exerted: true });

      const attackerOne = testStore.getByZoneAndId(
        "play",
        caterpillarCalmAndCollected.id,
      );
      const attackerTwo = testStore.getByZoneAndId(
        "play",
        jasmineHeirOfAgrabah.id,
      );

      attackerOne.challenge(defender);
      expect(testStore.stackLayers).toHaveLength(0);

      attackerTwo.challenge(defender);
      expect(testStore.stackLayers).toHaveLength(0);
    });
  });
});
