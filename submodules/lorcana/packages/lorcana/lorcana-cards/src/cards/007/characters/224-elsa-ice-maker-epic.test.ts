import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { elsaIceMakerEpic } from "./224-elsa-ice-maker-epic";
import { annaIceBreaker } from "./072-anna-ice-breaker";

const opponentCharacter = createMockCharacter({
  id: "elsa-epic-opponent-char",
  name: "Opponent Character",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Elsa - Ice Maker (Epic)", () => {
  it("has Shift 4 keyword", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [elsaIceMakerEpic],
    });

    expect(testEngine.asPlayerOne().hasKeyword(elsaIceMakerEpic, "Shift")).toBe(true);
  });

  describe("WINTER WALL - Whenever this character quests, you may exert chosen character. If you do and you have a character named Anna in play, the chosen character can't ready at the start of their next turn.", () => {
    it("Anna is in play: exerts chosen character and prevents them from readying at start of opponent's next turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [elsaIceMakerEpic, annaIceBreaker],
          deck: 3,
        },
        {
          play: [opponentCharacter],
          deck: 3,
        },
      );

      // Quest with Elsa — triggers WINTER WALL
      expect(testEngine.asPlayerOne().quest(elsaIceMakerEpic)).toBeSuccessfulCommand();

      // Resolve the bag — accept optional (yes, exert chosen character)
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(elsaIceMakerEpic, { targets: [opponentCharacter] }),
      ).toBeSuccessfulCommand();

      // The chosen character should now be exerted
      expect(testEngine.asPlayerTwo().isExerted(opponentCharacter)).toBe(true);

      // P1 passes — P2's turn starts — cant-ready prevents the character from readying
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().isExerted(opponentCharacter)).toBe(true);

      // P2 passes — P1's turn starts — character stays exerted (P2's chars don't ready on P1's turn)
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().isExerted(opponentCharacter)).toBe(true);

      // P1 passes — P2's second turn starts — restriction expired, character readies
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().isExerted(opponentCharacter)).toBe(false);
    });

    it("Anna is NOT in play: exerts chosen character but they CAN ready at start of their next turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [elsaIceMakerEpic],
          deck: 3,
        },
        {
          play: [{ card: opponentCharacter, exerted: true }],
          deck: 3,
        },
      );

      // Quest with Elsa — triggers WINTER WALL
      expect(testEngine.asPlayerOne().quest(elsaIceMakerEpic)).toBeSuccessfulCommand();

      // Resolve the bag — accept optional (yes, exert chosen character)
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(elsaIceMakerEpic, { targets: [opponentCharacter] }),
      ).toBeSuccessfulCommand();

      // The chosen character should now be exerted
      expect(testEngine.asPlayerTwo().isExerted(opponentCharacter)).toBe(true);

      // Opponent passes their turn — character SHOULD ready (no Anna = no cant-ready)
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().isExerted(opponentCharacter)).toBe(false);
    });
  });
});
