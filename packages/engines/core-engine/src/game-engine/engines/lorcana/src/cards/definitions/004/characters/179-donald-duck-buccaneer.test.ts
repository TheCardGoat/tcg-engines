/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import {
  heiheiBoatSnack,
  mauiHeroToAll,
  moanaOfMotunui,
  teKaHeartless,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import { donaldDuckBuccaneer } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";

describe("Donald Duck - Buccaneer", () => {
  describe("**BOARDING PARTY** During your turn, whenever this character banishes another character in a challenge, your other characters get +1 {L} this turn.", () => {
    it("should deal two damage", async () => {
      const otherCharacters = [moanaOfMotunui, mauiHeroToAll];
      const testStore = new TestEngine(
        {
          play: [donaldDuckBuccaneer, ...otherCharacters],
        },
        {
          play: [heiheiBoatSnack],
        },
      );

      await testStore.challenge({
        attacker: donaldDuckBuccaneer,
        defender: heiheiBoatSnack,
        exertDefender: true,
      });

      expect(testStore.stackLayers).toHaveLength(0);
      for (const character of otherCharacters) {
        expect(testStore.getCardModel(character).lore).toEqual(
          character.lore + 1,
        );
      }
    });

    it("opponent's don't get the bonus", () => {
      const otherCharacters = [moanaOfMotunui, mauiHeroToAll];
      const testStore = new TestStore(
        {
          play: [donaldDuckBuccaneer, ...otherCharacters],
        },
        {
          play: [heiheiBoatSnack, teKaHeartless],
        },
      );

      const attacker = testStore.getByZoneAndId("play", donaldDuckBuccaneer.id);
      const defender = testStore.getByZoneAndId(
        "play",
        heiheiBoatSnack.id,
        "player_two",
      );

      defender.updateCardMeta({ exerted: true });

      attacker.challenge(defender);

      const card = testStore.getByZoneAndId(
        "play",
        teKaHeartless.id,
        "player_two",
      );

      expect(card.lore).not.toEqual((card.lorcanitoCard?.lore || 0) + 1);
    });

    it("Mulan itself doesn't get the bonus", () => {
      const testStore = new TestStore(
        {
          play: [donaldDuckBuccaneer],
        },
        {
          play: [heiheiBoatSnack, teKaHeartless],
        },
      );

      const attacker = testStore.getByZoneAndId("play", donaldDuckBuccaneer.id);
      const defender = testStore.getByZoneAndId(
        "play",
        heiheiBoatSnack.id,
        "player_two",
      );

      defender.updateCardMeta({ exerted: true });

      attacker.challenge(defender);

      expect(attacker.lore).not.toEqual(
        (attacker.lorcanitoCard?.lore || 0) + 1,
      );
    });
  });
});
