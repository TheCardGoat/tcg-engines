import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_TWO,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { kuzcoSelfishEmperor } from "./149-kuzco-selfish-emperor";

const opponentItem = createMockItem({
  id: "kuzco-se-opponent-item",
  name: "Opponent Item",
  cost: 3,
});

const allyCharacter = createMockCharacter({
  id: "kuzco-se-ally-character",
  name: "Ally Character",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
});

describe("Kuzco - Selfish Emperor", () => {
  describe("OUTPLACEMENT — When you play this character, you may put chosen item or location into its player's inkwell facedown and exerted.", () => {
    it("moves a chosen item into its player's inkwell when Kuzco is played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [kuzcoSelfishEmperor],
          inkwell: kuzcoSelfishEmperor.cost,
          deck: 1,
        },
        {
          play: [opponentItem],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().playCard(kuzcoSelfishEmperor)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(kuzcoSelfishEmperor),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({
          resolveOptional: true,
          targets: [opponentItem],
        }),
      ).toBeSuccessfulCommand();

      // The item should now be in player two's inkwell
      expect(testEngine.asPlayerTwo().getZonesCardCount().inkwell).toBe(1);
      expect(testEngine.asPlayerTwo().getCardZone(opponentItem)).toBe("inkwell");
      // The item should be exerted
      expect(testEngine.isExerted(opponentItem)).toBe(true);
    });
  });

  describe("BY INVITE ONLY 4 {I} — Your other characters gain Resist +1 until the start of your next turn.", () => {
    it("grants Resist to other own characters when activated", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: kuzcoSelfishEmperor, isDrying: false }, allyCharacter],
        inkwell: 4,
        deck: 1,
      });

      expect(testEngine.asPlayerOne().hasKeyword(allyCharacter, "Resist")).toBe(false);

      expect(
        testEngine.asPlayerOne().activateAbility(kuzcoSelfishEmperor, "BY INVITE ONLY"),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().hasKeyword(allyCharacter, "Resist")).toBe(true);
      // Kuzco himself should NOT gain Resist
      expect(testEngine.asPlayerOne().hasKeyword(kuzcoSelfishEmperor, "Resist")).toBe(false);
    });

    it("Resist expires at the start of the next turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: kuzcoSelfishEmperor, isDrying: false }, allyCharacter],
          inkwell: 4,
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      expect(
        testEngine.asPlayerOne().activateAbility(kuzcoSelfishEmperor, "BY INVITE ONLY"),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().hasKeyword(allyCharacter, "Resist")).toBe(true);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // After a full round, Resist should have expired at start of player one's turn
      expect(testEngine.asPlayerOne().hasKeyword(allyCharacter, "Resist")).toBe(false);
    });
  });
});
