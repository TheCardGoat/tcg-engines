import { describe, expect, it } from "bun:test";
import { createMockCharacter, LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { annaDiplomaticQueen } from "./085-anna-diplomatic-queen";

const targetCharacter = createMockCharacter({
  id: "anna-test-target",
  name: "Test Target",
  cost: 2,
  strength: 3,
  willpower: 3,
  lore: 1,
});

const opponentHandCard = createMockCharacter({
  id: "anna-test-opponent-hand",
  name: "Opponent Hand Card",
  cost: 1,
  strength: 1,
  willpower: 1,
});

describe("Anna - Diplomatic Queen", () => {
  describe("ROYAL RESOLUTION - When you play this character, you may pay 2 ink to choose one", () => {
    it("can decline the optional ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: annaDiplomaticQueen.cost + 2,
          hand: [annaDiplomaticQueen],
        },
        {
          hand: [opponentHandCard],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().playCard(annaDiplomaticQueen)).toBeSuccessfulCommand();

      // Decline the optional ability
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(annaDiplomaticQueen, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // No further pending effects
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("Each opponent chooses and discards a card (mode 0)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: annaDiplomaticQueen.cost + 2,
          hand: [annaDiplomaticQueen],
        },
        {
          hand: [opponentHandCard],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().playCard(annaDiplomaticQueen)).toBeSuccessfulCommand();
      const opponentHandCardId = testEngine.findCardInstanceId(
        opponentHandCard,
        "hand",
        "player_two",
      );

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(annaDiplomaticQueen, { resolveOptional: true, choiceIndex: 0 }),
      ).toBeSuccessfulCommand();

      // "Each opponent chooses and discards" — the chooser flips to player_two
      // and submits their target directly.
      expect(
        testEngine.asPlayerTwo().resolveNextPending({ targets: [opponentHandCardId] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(opponentHandCard)).toBe("discard");
    });

    it("Chosen character gets +2 strength this turn (mode 1)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: annaDiplomaticQueen.cost + 2,
          hand: [annaDiplomaticQueen],
          play: [targetCharacter],
        },
        {
          deck: 1,
        },
      );

      const baseStrength = testEngine.asPlayerOne().getCardStrength(targetCharacter);

      expect(testEngine.asPlayerOne().playCard(annaDiplomaticQueen)).toBeSuccessfulCommand();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(annaDiplomaticQueen, { resolveOptional: true, choiceIndex: 1 }),
      ).toBeSuccessfulCommand();

      // Choose the target character
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [targetCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(targetCharacter)).toBe(baseStrength + 2);

      // Pass turn - the strength bonus should expire
      testEngine.asServer().passTurn();
      testEngine.asServer().passTurn();

      expect(testEngine.asPlayerOne().getCardStrength(targetCharacter)).toBe(baseStrength);
    });

    it("Banish chosen damaged character (mode 2)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: annaDiplomaticQueen.cost + 2,
          hand: [annaDiplomaticQueen],
          play: [{ card: targetCharacter, damage: 1 }],
        },
        {
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().playCard(annaDiplomaticQueen)).toBeSuccessfulCommand();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(annaDiplomaticQueen, { resolveOptional: true, choiceIndex: 2 }),
      ).toBeSuccessfulCommand();

      // Choose the damaged target character
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [targetCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(targetCharacter)).toBe("discard");
    });

    it("requires 2 additional ink to use the ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          // Only enough ink to play Anna, not enough for the 2 ink cost
          inkwell: annaDiplomaticQueen.cost,
          hand: [annaDiplomaticQueen],
        },
        {
          hand: [opponentHandCard],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().playCard(annaDiplomaticQueen)).toBeSuccessfulCommand();

      // Accept the optional ability - should fail or be auto-resolved since we can't pay
      const bagResult = testEngine
        .asPlayerOne()
        .resolvePendingByCard(annaDiplomaticQueen, { resolveOptional: true });

      // If the engine accepts the optional but fails to pay cost, the bag should clear
      // Either way, the opponent's hand card should NOT be discarded
      expect(testEngine.asPlayerTwo().getCardZone(opponentHandCard)).toBe("hand");
    });
  });
});
