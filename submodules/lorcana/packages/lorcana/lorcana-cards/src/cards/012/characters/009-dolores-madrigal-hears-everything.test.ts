import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { doloresMadrigalHearsEverything } from "./009-dolores-madrigal-hears-everything";

const opponentHandCardOne = createMockCharacter({
  id: "dolores-hears-opp-card-1",
  name: "Opponent Hand Card One",
  cost: 2,
  strength: 2,
  willpower: 2,
});

const opponentHandCardTwo = createMockCharacter({
  id: "dolores-hears-opp-card-2",
  name: "Opponent Hand Card Two",
  cost: 3,
  strength: 3,
  willpower: 3,
});

describe("Dolores Madrigal - Hears Everything", () => {
  describe("NO SECRETS - When you play this character, look at chosen opponent's hand.", () => {
    it("reveals the opponent's hand when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [doloresMadrigalHearsEverything],
          inkwell: doloresMadrigalHearsEverything.cost,
        },
        {
          hand: [opponentHandCardOne, opponentHandCardTwo],
        },
      );

      const opponentHandIds = testEngine.getCardInstanceIdsInZone("hand", PLAYER_TWO);

      expect(
        testEngine.asPlayerOne().playCard(doloresMadrigalHearsEverything),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(doloresMadrigalHearsEverything)).toBe("play");

      const cardMeta = testEngine.getAuthoritativeState().ctx.zones.private.cardMeta;
      for (const cardId of opponentHandIds) {
        expect(cardMeta[cardId]?.revealed).toBe(true);
      }
    });
  });
});
