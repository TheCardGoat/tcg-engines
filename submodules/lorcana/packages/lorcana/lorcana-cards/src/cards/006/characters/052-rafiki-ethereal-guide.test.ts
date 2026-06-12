import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { rafikiEtherealGuide } from "./052-rafiki-ethereal-guide";

const inkCard = createMockCharacter({
  id: "rafiki-ink-card",
  name: "Ink Card",
  cost: 1,
  inkable: true,
});

const drawCard1 = createMockCharacter({
  id: "rafiki-draw-card-1",
  name: "Draw Card 1",
  cost: 1,
});

const drawCard2 = createMockCharacter({
  id: "rafiki-draw-card-2",
  name: "Draw Card 2",
  cost: 1,
});

describe("Rafiki - Ethereal Guide", () => {
  it("has Shift 7", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [rafikiEtherealGuide],
    });

    const card = testEngine.asPlayerOne().getCard(rafikiEtherealGuide);
    expect(card).toMatchObject({ zone: "play" });
  });

  describe("ASTRAL ATTUNEMENT - During your turn, whenever a card is put into your inkwell, you may draw a card.", () => {
    it("triggers when a card is put into the inkwell and player draws a card", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [rafikiEtherealGuide],
          hand: [inkCard],
          deck: [drawCard1, drawCard2],
        },
        {
          deck: 1,
        },
      );

      // Ink a card to trigger the ability
      expect(testEngine.asPlayerOne().ink(inkCard)).toBeSuccessfulCommand();

      // Should have a bag effect from the triggered ability
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Accept the optional ability to draw a card
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(rafikiEtherealGuide, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Player should have drawn 1 card
      expect(testEngine.asPlayerOne().getZonesCardCount()).toEqual(
        expect.objectContaining({
          hand: 1,
        }),
      );
    });

    it("can decline the optional ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [rafikiEtherealGuide],
          hand: [inkCard],
          deck: [drawCard1, drawCard2],
        },
        {
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().ink(inkCard)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Decline the optional ability
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(rafikiEtherealGuide, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // No further effects
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      // Player should not have drawn any cards
      expect(testEngine.asPlayerOne().getZonesCardCount()).toEqual(
        expect.objectContaining({
          hand: 0,
        }),
      );
    });

    it("does not trigger during opponent's turn", () => {
      const opponentInkCard = createMockCharacter({
        id: "rafiki-opp-ink-card",
        name: "Opponent Ink Card",
        cost: 1,
        inkable: true,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [rafikiEtherealGuide],
          deck: [drawCard1],
        },
        {
          hand: [opponentInkCard],
          deck: 1,
        },
      );

      // Pass priority to player two
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Opponent inks a card
      expect(testEngine.asPlayerTwo().ink(opponentInkCard)).toBeSuccessfulCommand();

      // Rafiki's ability should NOT trigger during opponent's turn
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });
  });
});
