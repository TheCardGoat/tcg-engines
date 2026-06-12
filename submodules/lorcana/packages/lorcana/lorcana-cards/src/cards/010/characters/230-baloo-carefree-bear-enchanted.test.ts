import { describe, expect, it } from "bun:test";
import { createMockCharacter, LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { balooCarefreeBearEnchanted } from "./230-baloo-carefree-bear-enchanted";

const handCard = createMockCharacter({
  id: "baloo-hand-card",
  name: "Hand Card",
  cost: 1,
  strength: 1,
  willpower: 1,
});

const opponentHandCard = createMockCharacter({
  id: "baloo-opponent-hand-card",
  name: "Opponent Hand Card",
  cost: 1,
  strength: 1,
  willpower: 1,
});

describe("Baloo - Carefree Bear (Enchanted)", () => {
  it("has Shift 3", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [balooCarefreeBearEnchanted],
    });

    expect(testEngine.hasKeyword(balooCarefreeBearEnchanted, "Shift")).toBe(true);
  });

  describe("ROLL WITH IT - When you play this character, choose one", () => {
    it("Each player draws a card (mode 0)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: balooCarefreeBearEnchanted.cost,
          hand: [balooCarefreeBearEnchanted],
          deck: 10,
        },
        {
          deck: 10,
        },
      );

      expect(testEngine.asPlayerOne().playCard(balooCarefreeBearEnchanted)).toBeSuccessfulCommand();

      // Choose mode 0: Each player draws a card
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(balooCarefreeBearEnchanted, { choiceIndex: 0 }),
      ).toBeSuccessfulCommand();

      // Player one: played 1 card from hand, drew 1 = 1 in hand, 9 in deck
      expect(testEngine.asPlayerOne().getZonesCardCount()).toEqual(
        expect.objectContaining({
          hand: 1,
          deck: 9,
        }),
      );
      // Player two: drew 1 = 1 in hand, 9 in deck
      expect(testEngine.asPlayerTwo().getZonesCardCount()).toEqual(
        expect.objectContaining({
          hand: 1,
          deck: 9,
        }),
      );
    });

    it("Each player chooses and discards a card (mode 1)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: balooCarefreeBearEnchanted.cost,
          hand: [balooCarefreeBearEnchanted, handCard],
        },
        {
          hand: [opponentHandCard],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().playCard(balooCarefreeBearEnchanted)).toBeSuccessfulCommand();

      // Choose mode 1: Each player chooses and discards a card
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(balooCarefreeBearEnchanted, { choiceIndex: 1 }),
      ).toBeSuccessfulCommand();

      // Player one must choose a card to discard
      const handCardId = testEngine.findCardInstanceId(handCard, "hand", "p1");
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [handCardId] }),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(handCard)).toBe("discard");

      // Player two must choose a card to discard
      const opponentHandCardId = testEngine.findCardInstanceId(opponentHandCard, "hand", "p2");
      expect(
        testEngine.asPlayerTwo().resolveNextPending({ targets: [opponentHandCardId] }),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getCardZone(opponentHandCard)).toBe("discard");
    });
  });
});
