import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { basilDisguisedDetective } from "./091-basil-disguised-detective";

const inkCard = createMockCharacter({
  id: "basil-ink-card",
  name: "Ink Card",
  cost: 1,
  inkable: true,
});

const opponentHandCard1 = createMockCharacter({
  id: "basil-opp-hand-1",
  name: "Opponent Hand Card 1",
  cost: 1,
});

const opponentHandCard2 = createMockCharacter({
  id: "basil-opp-hand-2",
  name: "Opponent Hand Card 2",
  cost: 2,
});

describe("Basil - Disguised Detective", () => {
  it("Shift 4", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [basilDisguisedDetective],
    });

    const card = testEngine.asPlayerOne().getCard(basilDisguisedDetective);
    expect(card).toMatchObject({ zone: "play" });
  });

  describe("TWISTS AND TURNS - During your turn, whenever a card is put into your inkwell, you may pay 1 ink to have chosen opponent choose and discard a card", () => {
    it("triggers when a card is put into inkwell and opponent discards", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: 1,
          play: [basilDisguisedDetective],
          hand: [inkCard],
        },
        {
          hand: [opponentHandCard1, opponentHandCard2],
          deck: 1,
        },
      );

      // Ink a card to trigger the ability
      expect(testEngine.asPlayerOne().ink(inkCard)).toBeSuccessfulCommand();

      // Should have a bag effect from the triggered ability
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Accept the optional ability (pay 1 ink)
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(basilDisguisedDetective, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // The inner effect carries `chosenBy: "opponent"` — the chooser flips to
      // player_two, who is the only player with a pending resolution to consume.
      const oppCard1Id = testEngine.findCardInstanceId(opponentHandCard1, "hand", "player_two");
      expect(
        testEngine.asPlayerTwo().resolveNextPending({ targets: [oppCard1Id] }),
      ).toBeSuccessfulCommand();

      // Verify the card was discarded
      expect(testEngine.asPlayerTwo().getCardZone(opponentHandCard1)).toBe("discard");
    });

    it("can decline the optional ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: 1,
          play: [basilDisguisedDetective],
          hand: [inkCard],
        },
        {
          hand: [opponentHandCard1],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().ink(inkCard)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Decline the optional ability
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(basilDisguisedDetective, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // No further effects
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      // Opponent's card should still be in hand
      expect(testEngine.asPlayerTwo().getCardZone(opponentHandCard1)).toBe("hand");
    });
  });
});
