import { describe, expect, it } from "bun:test";
import {
  hadesMeticulousPlotter,
  sisuWiseFriend,
  tongSurvivor,
  tukTukCuriousPartner,
} from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters";
import { snugglyDucklingDisreputablePub } from "~/game-engine/engines/lorcana/src/cards/definitions/004/locations/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Snuggly Duckling - Disreputable Pub", () => {
  describe("**ROUTINE RUCKUS** Whenever a character with 3 {S} or more challenges another character while here, gain 1 lore. If the challenging character has 6 {S} or more, gain 3 lore instead.", () => {
    it("should not gain lore when a character with 2 {S} challenges another character", async () => {
      const testEngine = new TestEngine(
        {
          inkwell: snugglyDucklingDisreputablePub.moveCost,
          play: [snugglyDucklingDisreputablePub, tukTukCuriousPartner],
        },
        {
          play: [hadesMeticulousPlotter],
        },
      );

      await testEngine.tapCard(hadesMeticulousPlotter);
      await testEngine.moveToLocation({
        location: snugglyDucklingDisreputablePub,
        character: tukTukCuriousPartner,
      });

      await testEngine.challenge({
        attacker: tukTukCuriousPartner,
        defender: hadesMeticulousPlotter,
      });

      expect(testEngine.getPlayerLore()).toBe(0);
    });

    it("should gain 1 lore when a character with 3 {S} challenges another character", async () => {
      const testEngine = new TestEngine(
        {
          inkwell: snugglyDucklingDisreputablePub.moveCost,
          play: [snugglyDucklingDisreputablePub, tongSurvivor],
        },
        {
          play: [hadesMeticulousPlotter],
        },
      );

      await testEngine.tapCard(hadesMeticulousPlotter);
      await testEngine.moveToLocation({
        location: snugglyDucklingDisreputablePub,
        character: tongSurvivor,
      });

      await testEngine.challenge({
        attacker: tongSurvivor,
        defender: hadesMeticulousPlotter,
      });

      expect(testEngine.getPlayerLore()).toBe(1);
    });

    it("should gain 3 lore when a character with 6 {S} challenges another character", async () => {
      const testEngine = new TestEngine(
        {
          inkwell: snugglyDucklingDisreputablePub.moveCost,
          play: [snugglyDucklingDisreputablePub, sisuWiseFriend],
        },
        {
          play: [hadesMeticulousPlotter],
        },
      );

      await testEngine.tapCard(hadesMeticulousPlotter);
      await testEngine.moveToLocation({
        location: snugglyDucklingDisreputablePub,
        character: sisuWiseFriend,
      });

      await testEngine.challenge({
        attacker: sisuWiseFriend,
        defender: hadesMeticulousPlotter,
      });

      expect(testEngine.getPlayerLore()).toBe(3);
    });
  });
});
