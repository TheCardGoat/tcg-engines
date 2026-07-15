import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { donaldDuckDistractedTraveler } from "./084-donald-duck-distracted-traveler";

const anotherCharacter = createMockCharacter({
  id: "donald-ally",
  name: "Ally",
  cost: 1,
  strength: 1,
  willpower: 1,
});

const opponentHandCard = createMockCharacter({
  id: "donald-opponent-hand",
  name: "Opponent Hand Card",
  cost: 2,
  strength: 2,
  willpower: 2,
});

describe("Donald Duck - Distracted Traveler", () => {
  describe("BURNING CURIOSITY - Whenever this character quests, if you played another character this turn, each opponent chooses and discards a card.", () => {
    it("makes each opponent discard a chosen card when questing after playing another character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [anotherCharacter],
          play: [{ card: donaldDuckDistractedTraveler, isDrying: false }],
          inkwell: 1,
          deck: 1,
        },
        {
          hand: [opponentHandCard],
          deck: 1,
        },
      );

      const opponentHandCardId = testEngine.findCardInstanceId(
        opponentHandCard,
        "hand",
        PLAYER_TWO,
      );

      expect(testEngine.asPlayerOne().playCard(anotherCharacter)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().quest(donaldDuckDistractedTraveler)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerTwo().resolveNextPending({ targets: [opponentHandCardId] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(opponentHandCard)).toBe("discard");
    });

    it("does not trigger the discard when no other character was played this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: donaldDuckDistractedTraveler, isDrying: false }],
          deck: 1,
        },
        {
          hand: [opponentHandCard],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().quest(donaldDuckDistractedTraveler)).toBeSuccessfulCommand();

      // Condition is not met — no discard should be queued and lore should be gained normally.
      expect(testEngine.asPlayerTwo().getCardZone(opponentHandCard)).toBe("hand");
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(donaldDuckDistractedTraveler.lore);
    });
  });
});
