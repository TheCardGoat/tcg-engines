import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { princeJohnGoldLover } from "./147-prince-john-gold-lover";

const cheapItem = createMockItem({
  id: "prince-john-gl-cheap-item",
  name: "Cheap Item",
  cost: 5,
});

const expensiveItem = createMockItem({
  id: "prince-john-gl-expensive-item",
  name: "Expensive Item",
  cost: 6,
});

describe("Prince John - Gold Lover", () => {
  describe("BEAUTIFUL, LOVELY TAXES {E} — Play an item from your hand or discard with cost 5 or less for free, exerted.", () => {
    it("plays an item from hand for free and exerted when activated", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: princeJohnGoldLover, isDrying: false }],
        hand: [cheapItem],
        deck: 1,
      });

      const cheapItemId = testEngine.findCardInstanceId(cheapItem, "hand", PLAYER_ONE);

      expect(
        testEngine.asPlayerOne().activateAbility(princeJohnGoldLover, {
          ability: "BEAUTIFUL, LOVELY TAXES",
          targets: [cheapItemId],
        }),
      ).toBeSuccessfulCommand();

      // Prince John should be exerted after activating
      expect(testEngine.asPlayerOne().isExerted(princeJohnGoldLover)).toBe(true);

      // The item should now be in play, exerted
      expect(testEngine.asPlayerOne().getCardZone(cheapItem)).toBe("play");
      expect(testEngine.isExerted(cheapItem)).toBe(true);
    });

    it("plays an item from discard for free and exerted when activated", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: princeJohnGoldLover, isDrying: false }],
        discard: [cheapItem],
        deck: 1,
      });

      const cheapItemId = testEngine.findCardInstanceId(cheapItem, "discard", PLAYER_ONE);

      expect(
        testEngine.asPlayerOne().activateAbility(princeJohnGoldLover, {
          ability: "BEAUTIFUL, LOVELY TAXES",
          targets: [cheapItemId],
        }),
      ).toBeSuccessfulCommand();

      // Prince John should be exerted after activating
      expect(testEngine.asPlayerOne().isExerted(princeJohnGoldLover)).toBe(true);

      // The item should now be in play, exerted
      expect(testEngine.asPlayerOne().getCardZone(cheapItem)).toBe("play");
      expect(testEngine.isExerted(cheapItem)).toBe(true);
    });

    it("cannot play an item with cost greater than 5", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: princeJohnGoldLover, isDrying: false }],
        hand: [expensiveItem],
        deck: 1,
      });

      const expensiveItemId = testEngine.findCardInstanceId(expensiveItem, "hand", PLAYER_ONE);

      // Try to activate with the expensive item — should still succeed as a command
      // but the expensive item should not end up in play
      testEngine.asPlayerOne().activateAbility(princeJohnGoldLover, {
        ability: "BEAUTIFUL, LOVELY TAXES",
        targets: [expensiveItemId],
      });

      // Expensive item should still be in hand (not played)
      expect(testEngine.asPlayerOne().getCardZone(expensiveItem)).toBe("hand");
    });

    it("cannot be activated if Prince John is already exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: princeJohnGoldLover, isDrying: false, exerted: true }],
        hand: [cheapItem],
        deck: 1,
      });

      const cheapItemId = testEngine.findCardInstanceId(cheapItem, "hand", PLAYER_ONE);

      const result = testEngine.asPlayerOne().activateAbility(princeJohnGoldLover, {
        ability: "BEAUTIFUL, LOVELY TAXES",
        targets: [cheapItemId],
      });

      expect(result.success).toBe(false);
      expect(testEngine.asPlayerOne().getCardZone(cheapItem)).toBe("hand");
    });
  });
});
