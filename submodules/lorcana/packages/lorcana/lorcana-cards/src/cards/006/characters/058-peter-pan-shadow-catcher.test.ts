import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { peterPanShadowCatcher } from "./058-peter-pan-shadow-catcher";

const opponentCharacter = createMockCharacter({
  id: "pp-test-opp-1",
  name: "Opponent Character 1",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const opponentCharacter2 = createMockCharacter({
  id: "pp-test-opp-2",
  name: "Opponent Character 2",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const inkableCard = createMockCharacter({
  id: "pp-test-inkable",
  name: "Inkable Card",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
  inkable: true,
});

describe("Peter Pan - Shadow Catcher", () => {
  describe("GOTCHA! - During your turn, whenever a card is put into your inkwell, exert chosen opposing character.", () => {
    it("exerts chosen opposing character when a card is put into your inkwell during your turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [peterPanShadowCatcher],
          hand: [inkableCard],
          deck: 2,
        },
        {
          play: [{ card: opponentCharacter, exerted: false }],
          deck: 2,
        },
      );

      expect(testEngine.isExerted(opponentCharacter)).toBe(false);

      // Ink a card from hand - should trigger GOTCHA!
      expect(testEngine.asPlayerOne().ink(inkableCard)).toBeSuccessfulCommand();

      // Resolve the triggered ability - choose opponent character to exert
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(peterPanShadowCatcher, {
          targets: [opponentCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.isExerted(opponentCharacter)).toBe(true);
    });

    it("does not trigger during opponent's turn when opponent inks", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [peterPanShadowCatcher],
          deck: 2,
        },
        {
          play: [{ card: opponentCharacter, exerted: false }],
          hand: [inkableCard],
          deck: 2,
        },
      );

      // Pass to player two's turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Opponent inks a card - should NOT trigger GOTCHA!
      // The trigger says "your inkwell" so opponent inking into opponent's
      // inkwell does not trigger Peter Pan's ability
      expect(testEngine.asPlayerTwo().ink(inkableCard)).toBeSuccessfulCommand();

      // No bag to resolve - the ability should not have triggered
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.isExerted(opponentCharacter)).toBe(false);
    });
  });
});
