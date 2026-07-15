import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, CANONICAL_PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { tamatoaHappyAsAClam } from "./162-tamatoa-happy-as-a-clam";
import { sapphireCoil } from "../items/179-sapphire-coil";
import { steelCoil } from "../items/203-steel-coil";

describe("Tamatoa - Happy as a Clam", () => {
  describe("COOLEST COLLECTION - When you play this character, return up to 2 item cards from your discard to your hand.", () => {
    it("returns up to 2 item cards from discard to hand when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [tamatoaHappyAsAClam],
        discard: [{ card: sapphireCoil }, { card: steelCoil }],
        inkwell: tamatoaHappyAsAClam.cost,
        deck: 1,
      });

      expect(testEngine.asPlayerOne().playCard(tamatoaHappyAsAClam)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      const sapphireCoilId = testEngine.findCardInstanceId(sapphireCoil, "discard");
      const steelCoilId = testEngine.findCardInstanceId(steelCoil, "discard");

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(tamatoaHappyAsAClam, {
          targets: [sapphireCoilId, steelCoilId],
        }),
      ).toBeSuccessfulCommand();

      // Both items should now be in hand
      expect(testEngine.asPlayerOne().getCardZone(sapphireCoil)).toBe("hand");
      expect(testEngine.asPlayerOne().getCardZone(steelCoil)).toBe("hand");
    });

    it("can return fewer than 2 items (up to 2)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [tamatoaHappyAsAClam],
        discard: [{ card: sapphireCoil }, { card: steelCoil }],
        inkwell: tamatoaHappyAsAClam.cost,
        deck: 1,
      });

      expect(testEngine.asPlayerOne().playCard(tamatoaHappyAsAClam)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      const sapphireCoilId = testEngine.findCardInstanceId(sapphireCoil, "discard");

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(tamatoaHappyAsAClam, {
          targets: [sapphireCoilId],
        }),
      ).toBeSuccessfulCommand();

      // Only sapphireCoil should be in hand; steelCoil stays in discard
      expect(testEngine.asPlayerOne().getCardZone(sapphireCoil)).toBe("hand");
      expect(testEngine.asPlayerOne().getCardZone(steelCoil)).toBe("discard");
    });

    it("does not trigger when 0 items are in discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [tamatoaHappyAsAClam],
        discard: [],
        inkwell: tamatoaHappyAsAClam.cost,
        deck: 1,
      });

      expect(testEngine.asPlayerOne().playCard(tamatoaHappyAsAClam)).toBeSuccessfulCommand();

      // No pending effect and no bag entry when there are no valid discard targets
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(0);
    });
  });

  describe("I'M BEAUTIFUL, BABY! - Whenever this character quests, you may play an item for free.", () => {
    it("triggers when this character quests and allows playing an item for free", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: tamatoaHappyAsAClam, isDrying: false }],
        hand: [sapphireCoil],
        inkwell: 0,
        deck: 1,
      });

      // No ink available — item cannot be played normally
      expect(testEngine.asPlayerOne().getAvailableInk(CANONICAL_PLAYER_ONE)).toBe(0);

      expect(testEngine.asPlayerOne().quest(tamatoaHappyAsAClam)).toBeSuccessfulCommand();

      // Optional triggered ability should be in the bag
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Accept the optional effect and choose the item from hand
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(tamatoaHappyAsAClam, {
          resolveOptional: true,
          targets: [sapphireCoil],
        }),
      ).toBeSuccessfulCommand();

      // The item should be in play
      expect(testEngine.asPlayerOne().getCardZone(sapphireCoil)).toBe("play");

      // No ink should have been spent
      expect(testEngine.asPlayerOne().getAvailableInk(CANONICAL_PLAYER_ONE)).toBe(0);
    });

    it("allows declining the optional trigger", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: tamatoaHappyAsAClam, isDrying: false }],
        hand: [sapphireCoil],
        inkwell: 5,
        deck: 1,
      });

      expect(testEngine.asPlayerOne().quest(tamatoaHappyAsAClam)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(tamatoaHappyAsAClam, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      // Item should remain in hand
      expect(testEngine.asPlayerOne().getCardZone(sapphireCoil)).toBe("hand");
    });
  });
});
