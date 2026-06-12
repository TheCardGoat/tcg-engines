import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { pixieDust } from "../items/067-pixie-dust";
import { poohPirateShip } from "../items/032-pooh-pirate-ship";
import { yokaiEnigmaticInventor } from "./143-yokai-enigmatic-inventor";

describe("Yokai - Enigmatic Inventor", () => {
  describe("TIME TO UPGRADE - Whenever this character quests, you may return one of your items to your hand to pay 2 {I} less for the next item you play this turn.", () => {
    it("reduces the cost of the next item by 2 when an item is returned to hand after questing", () => {
      // pixieDust costs 4; inkwell = 2, so without discount it can't be played
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: yokaiEnigmaticInventor, isDrying: false }, poohPirateShip],
        hand: [pixieDust],
        inkwell: pixieDust.cost - 2,
        deck: 5,
      });

      expect(testEngine.asPlayerOne().canPlayCard(pixieDust)).toBe(false);

      expect(testEngine.asPlayerOne().quest(yokaiEnigmaticInventor)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Accept the optional: return poohPirateShip to hand
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(yokaiEnigmaticInventor, {
          resolveOptional: true,
          targets: [poohPirateShip],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(poohPirateShip)).toBe("hand");
      expect(testEngine.asPlayerOne().canPlayCard(pixieDust)).toBe(true);

      expect(testEngine.asPlayerOne().playCard(pixieDust)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(pixieDust)).toBe("play");
    });

    it("does not reduce cost when the optional is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: yokaiEnigmaticInventor, isDrying: false }, poohPirateShip],
        hand: [pixieDust],
        inkwell: pixieDust.cost - 2,
        deck: 5,
      });

      expect(testEngine.asPlayerOne().canPlayCard(pixieDust)).toBe(false);

      expect(testEngine.asPlayerOne().quest(yokaiEnigmaticInventor)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Decline the optional
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(yokaiEnigmaticInventor, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(poohPirateShip)).toBe("play");
      // No discount applied: still can't play pixieDust
      expect(testEngine.asPlayerOne().canPlayCard(pixieDust)).toBe(false);
    });

    it("cost reduction is consumed after playing the first item", () => {
      // Two cheap items in hand; after discount one can be played, second cannot
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: yokaiEnigmaticInventor, isDrying: false }, poohPirateShip],
        hand: [pixieDust, pixieDust],
        inkwell: pixieDust.cost - 2,
        deck: 5,
      });

      expect(testEngine.asPlayerOne().quest(yokaiEnigmaticInventor)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(yokaiEnigmaticInventor, {
          resolveOptional: true,
          targets: [poohPirateShip],
        }),
      ).toBeSuccessfulCommand();

      // First item can be played at reduced cost
      expect(testEngine.asPlayerOne().canPlayCard(pixieDust)).toBe(true);
      expect(testEngine.asPlayerOne().playCard(pixieDust)).toBeSuccessfulCommand();

      // Reduction is consumed: second item cannot be played with remaining ink (0 left)
      expect(testEngine.asPlayerOne().canPlayCard(pixieDust)).toBe(false);
    });
  });
});
