import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_TWO,
  createMockAction,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { mowgliManCub } from "./019-mowgli-man-cub";

const opponentAction1 = createMockAction({
  id: "mowgli-opp-action-1",
  name: "Opponent Action 1",
  cost: 2,
});

const opponentAction2 = createMockAction({
  id: "mowgli-opp-action-2",
  name: "Opponent Action 2",
  cost: 3,
});

const opponentCharacter = createMockCharacter({
  id: "mowgli-opp-char",
  name: "Opponent Character",
  cost: 2,
  strength: 2,
  willpower: 2,
});

describe("Mowgli - Man Cub", () => {
  describe("HAVE A BETTER LOOK - When you play this character, chosen opponent reveals their hand and discards a non-character card of their choice.", () => {
    it("reveals the opponent's hand and opponent chooses which non-character card to discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [mowgliManCub],
          inkwell: mowgliManCub.cost,
        },
        {
          hand: [opponentAction1, opponentAction2, opponentCharacter],
        },
      );

      const opponentHandIds = testEngine.getCardInstanceIdsInZone("hand", PLAYER_TWO);
      const action1Id = testEngine.findCardInstanceId(opponentAction1, "hand", PLAYER_TWO);

      // Play Mowgli — triggers the ability
      expect(testEngine.asPlayerOne().playCard(mowgliManCub)).toBeSuccessfulCommand();

      // Opponent chooses which non-character card to discard
      expect(
        testEngine.asPlayerTwo().resolveNextPending({
          resolveOptional: true,
          targets: [action1Id],
        }),
      ).toBeSuccessfulCommand();

      // The chosen action card should be discarded
      expect(testEngine.asPlayerTwo().getCardZone(opponentAction1)).toBe("discard");

      // The other action card should still be in hand (opponent chose a different one)
      expect(testEngine.asPlayerTwo().getCardZone(opponentAction2)).toBe("hand");

      // Character card should still be in hand (cannot discard character cards with this ability)
      expect(testEngine.asPlayerTwo().getCardZone(opponentCharacter)).toBe("hand");

      // All opponent hand cards should have been revealed
      const cardMeta = testEngine.getAuthoritativeState().ctx.zones.private.cardMeta;
      for (const cardId of opponentHandIds) {
        expect(cardMeta[cardId]?.revealed).toBe(true);
      }
    });

    it("opponent must still resolve pending even with only one valid non-character card", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [mowgliManCub],
          inkwell: mowgliManCub.cost,
        },
        {
          hand: [opponentAction1, opponentCharacter],
        },
      );

      const action1Id = testEngine.findCardInstanceId(opponentAction1, "hand", PLAYER_TWO);

      // Play Mowgli — triggers the ability
      expect(testEngine.asPlayerOne().playCard(mowgliManCub)).toBeSuccessfulCommand();

      // Opponent resolves the pending discard choice
      expect(
        testEngine.asPlayerTwo().resolveNextPending({
          resolveOptional: true,
          targets: [action1Id],
        }),
      ).toBeSuccessfulCommand();

      // The only action card is discarded
      expect(testEngine.asPlayerTwo().getCardZone(opponentAction1)).toBe("discard");

      // Character card stays in hand
      expect(testEngine.asPlayerTwo().getCardZone(opponentCharacter)).toBe("hand");
    });

    it("does not discard when opponent has only character cards", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [mowgliManCub],
          inkwell: mowgliManCub.cost,
        },
        {
          hand: [opponentCharacter],
        },
      );

      expect(testEngine.asPlayerOne().playCard(mowgliManCub)).toBeSuccessfulCommand();

      // Character card stays in hand (no valid non-character targets)
      expect(testEngine.asPlayerTwo().getCardZone(opponentCharacter)).toBe("hand");
    });
  });
});
