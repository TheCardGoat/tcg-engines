import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { flotsamJetsamEntanglingEels } from "./044-flotsam-jetsam-entangling-eels";
import { flotsamUrsulasBaby } from "./043-flotsam-ursulas-baby";
import { jetsamUrsulasBaby } from "./046-jetsam-ursulas-baby";
import { flotsamRiffraff } from "../../003/characters/072-flotsam-riffraff";

const handFodder1 = createMockCharacter({
  id: "flotsam-hand-fodder-1",
  name: "Hand Fodder 1",
  cost: 1,
});

const handFodder2 = createMockCharacter({
  id: "flotsam-hand-fodder-2",
  name: "Hand Fodder 2",
  cost: 1,
});

describe("Flotsam & Jetsam - Entangling Eels", () => {
  describe("Shift: Discard 2 cards", () => {
    it("can shift onto a character named Flotsam by discarding 2 cards from hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 0,
        play: [flotsamUrsulasBaby],
        hand: [handFodder1, handFodder2, flotsamJetsamEntanglingEels],
      });

      const shiftTarget = testEngine.findCardInstanceId(flotsamUrsulasBaby, "play", PLAYER_ONE);
      const discard1 = testEngine.findCardInstanceId(handFodder1, "hand", PLAYER_ONE);
      const discard2 = testEngine.findCardInstanceId(handFodder2, "hand", PLAYER_ONE);

      expect(
        testEngine.asPlayerOne().playCard(flotsamJetsamEntanglingEels, {
          cost: {
            cost: "shift",
            shiftTarget,
            discardCards: [discard1, discard2],
          },
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(flotsamJetsamEntanglingEels)).toBe("play");
      expect(testEngine.asPlayerOne().getCardZone(handFodder1)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(handFodder2)).toBe("discard");
    });

    it("can shift onto a character named Jetsam by discarding 2 cards from hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 0,
        play: [jetsamUrsulasBaby],
        hand: [handFodder1, handFodder2, flotsamJetsamEntanglingEels],
      });

      const shiftTarget = testEngine.findCardInstanceId(jetsamUrsulasBaby, "play", PLAYER_ONE);
      const discard1 = testEngine.findCardInstanceId(handFodder1, "hand", PLAYER_ONE);
      const discard2 = testEngine.findCardInstanceId(handFodder2, "hand", PLAYER_ONE);

      expect(
        testEngine.asPlayerOne().playCard(flotsamJetsamEntanglingEels, {
          cost: {
            cost: "shift",
            shiftTarget,
            discardCards: [discard1, discard2],
          },
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(flotsamJetsamEntanglingEels)).toBe("play");
      expect(testEngine.asPlayerOne().getCardZone(handFodder1)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(handFodder2)).toBe("discard");
    });

    it("cannot shift without discarding 2 cards", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 0,
        play: [flotsamUrsulasBaby],
        hand: [handFodder1, flotsamJetsamEntanglingEels],
      });

      const shiftTarget = testEngine.findCardInstanceId(flotsamUrsulasBaby, "play", PLAYER_ONE);
      const discard1 = testEngine.findCardInstanceId(handFodder1, "hand", PLAYER_ONE);

      const result = testEngine.asPlayerOne().playCard(flotsamJetsamEntanglingEels, {
        cost: {
          cost: "shift",
          shiftTarget,
          discardCards: [discard1],
        },
      });

      expect(result.success).toBe(false);
    });

    it("cannot shift onto a character with a different name", () => {
      const differentCharacter = createMockCharacter({
        id: "different-char",
        name: "Ursula",
        cost: 3,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 0,
        play: [differentCharacter],
        hand: [handFodder1, handFodder2, flotsamJetsamEntanglingEels],
      });

      const shiftTarget = testEngine.findCardInstanceId(differentCharacter, "play", PLAYER_ONE);
      const discard1 = testEngine.findCardInstanceId(handFodder1, "hand", PLAYER_ONE);
      const discard2 = testEngine.findCardInstanceId(handFodder2, "hand", PLAYER_ONE);

      const result = testEngine.asPlayerOne().playCard(flotsamJetsamEntanglingEels, {
        cost: {
          cost: "shift",
          shiftTarget,
          discardCards: [discard1, discard2],
        },
      });

      expect(result.success).toBe(false);
    });

    it("counts as being named Jetsam for name-based effects", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [flotsamRiffraff, flotsamJetsamEntanglingEels],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getCardStrength(flotsamJetsamEntanglingEels)).toBe(
        flotsamJetsamEntanglingEels.strength + 3,
      );
    });
  });
});
