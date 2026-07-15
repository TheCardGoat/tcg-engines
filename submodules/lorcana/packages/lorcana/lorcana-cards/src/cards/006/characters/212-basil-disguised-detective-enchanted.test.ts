import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { basilDisguisedDetectiveEnchanted } from "./212-basil-disguised-detective-enchanted";

const inkCard = createMockCharacter({
  id: "basil-ink-card",
  name: "Ink Card",
  cost: 1,
  inkable: true,
});

const opponentCard1 = createMockCharacter({
  id: "basil-opp-card-1",
  name: "Opponent Card 1",
  cost: 2,
});

const opponentCard2 = createMockCharacter({
  id: "basil-opp-card-2",
  name: "Opponent Card 2",
  cost: 3,
});

describe("Basil - Disguised Detective (Enchanted)", () => {
  it("has Shift 4", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [basilDisguisedDetectiveEnchanted],
    });

    expect(testEngine.asPlayerOne().getCardZone(basilDisguisedDetectiveEnchanted)).toBe("play");
  });

  describe("TWISTS AND TURNS", () => {
    it("triggers when a card is put into inkwell, pay 1 ink, opponent chooses and discards a card", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: 1,
          hand: [inkCard],
          play: [basilDisguisedDetectiveEnchanted],
        },
        {
          hand: [opponentCard1, opponentCard2],
        },
      );

      // Ink a card - should trigger TWISTS AND TURNS
      expect(testEngine.asPlayerOne().ink(inkCard)).toBeSuccessfulCommand();

      // Should have a bag effect for the triggered ability
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Accept the optional ability (pay 1 ink)
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(basilDisguisedDetectiveEnchanted, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // The inner effect carries `chosenBy: "opponent"` — the discard prompt
      // is owned by player_two, who submits the target directly.
      const oppCard1Id = testEngine.findCardInstanceId(opponentCard1, "hand", "player_two");
      expect(
        testEngine.asPlayerTwo().resolveNextPending({ targets: [oppCard1Id] }),
      ).toBeSuccessfulCommand();

      // The chosen card should be discarded
      expect(testEngine.asPlayerTwo().getCardZone(opponentCard1)).toBe("discard");
      // The other card should remain in hand
      expect(testEngine.asPlayerTwo().getCardZone(opponentCard2)).toBe("hand");
    });

    it("can decline the optional ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: 1,
          hand: [inkCard],
          play: [basilDisguisedDetectiveEnchanted],
        },
        {
          hand: [opponentCard1],
        },
      );

      expect(testEngine.asPlayerOne().ink(inkCard)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Decline
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(basilDisguisedDetectiveEnchanted, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Opponent's card stays in hand
      expect(testEngine.asPlayerTwo().getCardZone(opponentCard1)).toBe("hand");
    });
  });
});
