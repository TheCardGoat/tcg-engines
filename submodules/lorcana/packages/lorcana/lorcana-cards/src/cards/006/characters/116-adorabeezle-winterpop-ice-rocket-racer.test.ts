import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { adorabeezleWinterpopIceRocketRacer } from "./116-adorabeezle-winterpop-ice-rocket-racer";

describe("Adorabeezle Winterpop - Ice Rocket Racer", () => {
  describe("KEEP DRIVING — While this character has damage, she gets +1 {L}.", () => {
    it("has base lore of 1 when undamaged", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: adorabeezleWinterpopIceRocketRacer }],
      });

      const cardId = testEngine.findCardInstanceId(adorabeezleWinterpopIceRocketRacer, "play");
      const card = testEngine.asServer().getCard(cardId);
      expect(card.lore).toBe(1);
    });

    it("gets +1 lore when she has damage", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: adorabeezleWinterpopIceRocketRacer }],
      });

      const cardId = testEngine.findCardInstanceId(adorabeezleWinterpopIceRocketRacer, "play");

      // Set damage on the character
      testEngine.asServer().manualSetDamage(cardId, 1);

      const card = testEngine.asServer().getCard(cardId);
      expect(card.lore).toBe(2); // 1 base + 1 from KEEP DRIVING
    });

    it("loses the +1 lore bonus when damage is removed", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: adorabeezleWinterpopIceRocketRacer }],
      });

      const cardId = testEngine.findCardInstanceId(adorabeezleWinterpopIceRocketRacer, "play");

      // Add damage
      testEngine.asServer().manualSetDamage(cardId, 1);
      let card = testEngine.asServer().getCard(cardId);
      expect(card.lore).toBe(2);

      // Remove damage
      testEngine.asServer().manualSetDamage(cardId, 0);
      card = testEngine.asServer().getCard(cardId);
      expect(card.lore).toBe(1); // Back to base
    });
  });
});
