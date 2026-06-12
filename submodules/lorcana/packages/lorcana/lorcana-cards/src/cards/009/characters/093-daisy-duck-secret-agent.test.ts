import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { daisyDuckSecretAgent } from "./093-daisy-duck-secret-agent";

const opponentHandCard1 = createMockCharacter({
  id: "daisy-secret-agent-opponent-hand-1",
  name: "Opponent Hand Card 1",
  cost: 1,
});

const opponentHandCard2 = createMockCharacter({
  id: "daisy-secret-agent-opponent-hand-2",
  name: "Opponent Hand Card 2",
  cost: 2,
});

describe("Daisy Duck - Secret Agent", () => {
  describe("THWART - Whenever this character quests, each opponent chooses and discards a card.", () => {
    it("makes the opponent discard a chosen card after Daisy quests", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: daisyDuckSecretAgent, isDrying: false }],
          deck: 1,
        },
        {
          hand: [opponentHandCard1, opponentHandCard2],
          deck: 1,
        },
      );

      const opponentHandCard1Id = testEngine.findCardInstanceId(
        opponentHandCard1,
        "hand",
        PLAYER_TWO,
      );

      expect(testEngine.asPlayerOne().quest(daisyDuckSecretAgent)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerTwo().resolveNextPending({ targets: [opponentHandCard1Id] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(opponentHandCard1)).toBe("discard");
      expect(testEngine.asPlayerTwo().getCardZone(opponentHandCard2)).toBe("hand");
    });
  });
});
