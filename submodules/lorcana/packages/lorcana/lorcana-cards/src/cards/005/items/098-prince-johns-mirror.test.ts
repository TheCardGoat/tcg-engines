import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { princeJohnsMirror } from "./098-prince-johns-mirror";

const princeJohn = createMockCharacter({
  id: "prince-johns-mirror-prince-john",
  name: "Prince John",
  cost: 3,
});

const handCard1 = createMockCharacter({
  id: "prince-johns-mirror-hand-1",
  name: "Hand Card 1",
  cost: 1,
});
const handCard2 = createMockCharacter({
  id: "prince-johns-mirror-hand-2",
  name: "Hand Card 2",
  cost: 1,
});
const handCard3 = createMockCharacter({
  id: "prince-johns-mirror-hand-3",
  name: "Hand Card 3",
  cost: 1,
});
const handCard4 = createMockCharacter({
  id: "prince-johns-mirror-hand-4",
  name: "Hand Card 4",
  cost: 1,
});
const handCard5 = createMockCharacter({
  id: "prince-johns-mirror-hand-5",
  name: "Hand Card 5",
  cost: 1,
});

describe("Prince John's Mirror", () => {
  it("costs 1 less to play if you have a character named Prince John in play", () => {
    const discountedEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [princeJohnsMirror],
      inkwell: 2,
      play: [princeJohn],
      deck: 2,
    });

    expect(discountedEngine.asPlayerOne().playCard(princeJohnsMirror)).toBeSuccessfulCommand();

    const fullPriceEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [princeJohnsMirror],
      inkwell: 2,
      deck: 2,
    });

    expect(fullPriceEngine.asPlayerOne().playCard(princeJohnsMirror).success).toBe(false);
  });

  describe("A FEELING OF POWER - At the end of each opponent's turn, if they have more than 3 cards in their hand, they discard until they have 3 cards in their hand.", () => {
    it("triggers at the end of the opponent's turn when they have more than 3 cards in hand", () => {
      // P2 owns the mirror; P1 ends their turn with 5 cards — mirror should trigger
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [handCard1, handCard2, handCard3, handCard4, handCard5],
          deck: 2,
        },
        {
          play: [princeJohnsMirror],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // After P1 passes turn, the mirror triggers: P1 has 5 cards > 3
      expect(testEngine.asPlayerTwo().getBagCount()).toBeGreaterThanOrEqual(1);
    });

    it("forces the opponent to discard down to 3 cards (P2 owns mirror, P1 discards)", () => {
      // P2 owns the mirror; P1 ends their turn with 5 cards
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [handCard1, handCard2, handCard3, handCard4, handCard5],
          deck: 2,
        },
        {
          play: [princeJohnsMirror],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // P2 resolves the triggered ability from the bag (P2 is the mirror controller)
      const [bagEffect] = testEngine.asPlayerTwo().getBagEffects();
      expect(bagEffect).toBeDefined();
      expect(
        testEngine.asPlayerTwo().resolvePendingByCard(princeJohnsMirror),
      ).toBeSuccessfulCommand();

      // After the bag resolves, P1 (target of discard) must choose which cards to discard
      // P1 has 5 cards; needs to discard 2 (5-3=2)
      const handCard4Id = testEngine.findCardInstanceId(handCard4, "hand", "player_one");
      const handCard5Id = testEngine.findCardInstanceId(handCard5, "hand", "player_one");

      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [handCard4Id, handCard5Id] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(handCard4)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(handCard5)).toBe("discard");
      // Remaining 3 cards stay in hand
      expect(testEngine.asPlayerOne().getCardZone(handCard1)).toBe("hand");
      expect(testEngine.asPlayerOne().getCardZone(handCard2)).toBe("hand");
      expect(testEngine.asPlayerOne().getCardZone(handCard3)).toBe("hand");
    });

    it("does not trigger when opponent has 3 or fewer cards in hand", () => {
      // P2 owns the mirror; P1 ends their turn with exactly 3 cards
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [handCard1, handCard2, handCard3],
          deck: 2,
        },
        {
          play: [princeJohnsMirror],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Board-state condition is checked at trigger time, ability is not queued when condition is false.
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);
    });

    it("forces the opponent to discard down to 3 cards (P1 owns mirror, P2 discards)", () => {
      // P1 owns the mirror; P2 starts their turn with 4 cards + draws 1 = 5 cards, must discard 2
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [princeJohnsMirror],
          deck: 2,
        },
        {
          hand: [handCard1, handCard2, handCard3, handCard4],
          deck: 5,
        },
      );

      // P1 passes first
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      // P2's turn starts — P2 draws a card (now has 5), then passes
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // Mirror is owned by P1; at end of P2's turn, P2 has 5 cards > 3, trigger fires
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(princeJohnsMirror),
      ).toBeSuccessfulCommand();

      // P2 (target of discard) chooses which 2 cards to discard (5 - 3 = 2)
      const handCard4Id = testEngine.findCardInstanceId(handCard4, "hand", "player_two");
      const handCard3Id = testEngine.findCardInstanceId(handCard3, "hand", "player_two");

      expect(
        testEngine.asPlayerTwo().resolveNextPending({ targets: [handCard4Id, handCard3Id] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(handCard4)).toBe("discard");
      expect(testEngine.asPlayerTwo().getCardZone(handCard3)).toBe("discard");
      // Remaining 3 cards stay in hand
      expect(testEngine.asPlayerTwo().getCardZone(handCard1)).toBe("hand");
      expect(testEngine.asPlayerTwo().getCardZone(handCard2)).toBe("hand");
    });

    it("regression: trigger prompt shown to mirror controller (P1), not to the opponent who needs to discard", () => {
      // P1 owns the mirror. P2 ends their turn with > 3 cards.
      // The bag/trigger should appear for P1 (the mirror controller), and the discard choice for P2.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [princeJohnsMirror],
          deck: 2,
        },
        {
          hand: [handCard1, handCard2, handCard3, handCard4],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // The trigger should be in P1's bag (mirror controller), not P2's
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);

      // P2 should NOT have the bag trigger (they are the target, not the controller)
      const p2BagEffects = testEngine
        .asPlayerTwo()
        .getBagEffects()
        .filter((b: { controllerId: string }) => b.controllerId === "player_two");
      expect(p2BagEffects.length).toBe(0);

      // P1 resolves the trigger
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(princeJohnsMirror),
      ).toBeSuccessfulCommand();

      // P2 (the opponent) chooses which cards to discard
      const handCard4Id = testEngine.findCardInstanceId(handCard4, "hand", "player_two");
      const handCard3Id = testEngine.findCardInstanceId(handCard3, "hand", "player_two");
      expect(
        testEngine.asPlayerTwo().resolveNextPending({ targets: [handCard4Id, handCard3Id] }),
      ).toBeSuccessfulCommand();
    });
  });
});
