import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { herculesYoungRescuer } from "./123-hercules-young-rescuer";

const handCardOne = createMockCharacter({
  id: "hercules-young-rescuer-hand-card-one",
  name: "Hand Card One",
  cost: 1,
});

const handCardTwo = createMockCharacter({
  id: "hercules-young-rescuer-hand-card-two",
  name: "Hand Card Two",
  cost: 1,
});

const discardTarget = createMockCharacter({
  id: "hercules-young-rescuer-discard-target",
  name: "Discard Target",
  cost: 3,
  strength: 3,
  willpower: 3,
});

describe("Hercules - Young Rescuer", () => {
  describe("Heroic Sacrifice - When you play this character, you may discard your hand. If you do, return a card from your discard to your hand.", () => {
    it("discards the remaining hand and returns a chosen card from discard when accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [herculesYoungRescuer, handCardOne, handCardTwo],
        inkwell: herculesYoungRescuer.cost,
        discard: [discardTarget],
        deck: 2,
      });

      const playerOne = testEngine.asPlayerOne();

      expect(playerOne.playCard(herculesYoungRescuer)).toBeSuccessfulCommand();
      expect(playerOne.getCardZone(herculesYoungRescuer)).toBe("play");

      expect(
        playerOne.resolvePendingByCard(herculesYoungRescuer, {
          resolveOptional: true,
          targets: [discardTarget],
        }),
      ).toBeSuccessfulCommand();

      expect(playerOne.getCardZone(handCardOne)).toBe("discard");
      expect(playerOne.getCardZone(handCardTwo)).toBe("discard");
      expect(playerOne.getCardZone(discardTarget)).toBe("hand");
    });

    it("release notes ruling: when Hercules is the only card in hand, his ability still resolves and lets you return a card from discard", () => {
      // Q&A: Discarding your hand doesn't require having any cards in hand.
      // After playing Hercules, the hand becomes empty; the optional ability
      // should still resolve and let the player return a card from discard.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [herculesYoungRescuer],
        inkwell: herculesYoungRescuer.cost,
        discard: [discardTarget],
        deck: 2,
      });

      const playerOne = testEngine.asPlayerOne();

      expect(playerOne.playCard(herculesYoungRescuer)).toBeSuccessfulCommand();
      expect(playerOne.getCardZone(herculesYoungRescuer)).toBe("play");

      // Hand is now empty (only Hercules was in it). Heroic Sacrifice still
      // allows resolving — discarding 0 cards is legal.
      expect(
        playerOne.resolvePendingByCard(herculesYoungRescuer, {
          resolveOptional: true,
          targets: [discardTarget],
        }),
      ).toBeSuccessfulCommand();

      expect(playerOne.getCardZone(discardTarget)).toBe("hand");
    });

    it("can decline the optional ability, keeping the hand intact", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [herculesYoungRescuer, handCardOne],
        inkwell: herculesYoungRescuer.cost,
        discard: [discardTarget],
        deck: 2,
      });

      const playerOne = testEngine.asPlayerOne();

      expect(playerOne.playCard(herculesYoungRescuer)).toBeSuccessfulCommand();

      expect(
        playerOne.resolvePendingByCard(herculesYoungRescuer, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      expect(playerOne.getCardZone(handCardOne)).toBe("hand");
      expect(playerOne.getCardZone(discardTarget)).toBe("discard");
    });
  });
});
