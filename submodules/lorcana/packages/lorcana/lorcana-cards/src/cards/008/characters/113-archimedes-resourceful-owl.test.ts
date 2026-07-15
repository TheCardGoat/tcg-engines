import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { archimedesResourcefulOwl } from "./113-archimedes-resourceful-owl";

const mockItem = createMockItem({
  id: "archimedes-test-item",
  name: "Test Item",
  cost: 1,
});

const opponentItem = createMockItem({
  id: "archimedes-opponent-item",
  name: "Opponent Item",
  cost: 1,
});

const mockCharacter = createMockCharacter({
  id: "archimedes-test-char",
  name: "Test Character",
  cost: 1,
  strength: 1,
  willpower: 1,
});

describe("Archimedes - Resourceful Owl", () => {
  describe("YOU DON'T NEED THAT — When you play this character, you may banish chosen item.", () => {
    it("can banish an item when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [archimedesResourcefulOwl],
          inkwell: 3,
        },
        {
          play: [opponentItem],
        },
      );

      expect(testEngine.asPlayerOne().playCard(archimedesResourcefulOwl)).toBeSuccessfulCommand();

      // Resolve the optional - accept it
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(archimedesResourcefulOwl, { targets: [opponentItem] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(opponentItem)).toBe("discard");
    });

    it("can decline banishing an item when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [archimedesResourcefulOwl],
          inkwell: 3,
        },
        {
          play: [opponentItem],
        },
      );

      expect(testEngine.asPlayerOne().playCard(archimedesResourcefulOwl)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(archimedesResourcefulOwl, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(opponentItem)).toBe("play");
    });

    it("can banish own item when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [archimedesResourcefulOwl],
          play: [mockItem],
          inkwell: 3,
        },
        {},
      );

      expect(testEngine.asPlayerOne().playCard(archimedesResourcefulOwl)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(archimedesResourcefulOwl, { targets: [mockItem] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(mockItem)).toBe("discard");
    });
  });

  describe("NOW, THAT'S NOT BAD — During your turn, whenever an item is banished, you may draw a card, then choose and discard a card.", () => {
    it("triggers when an item is banished during your turn (via first ability)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [archimedesResourcefulOwl],
          deck: 3,
          inkwell: 3,
        },
        {
          play: [opponentItem],
        },
      );

      expect(testEngine.asPlayerOne().playCard(archimedesResourcefulOwl)).toBeSuccessfulCommand();

      // First bag effect: "You Don't Need That" (optional banish item)
      const bagEffects1 = testEngine.asPlayerOne().getBagEffects();
      const banishBag = bagEffects1[0];
      expect(banishBag).toBeDefined();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(archimedesResourcefulOwl, { targets: [opponentItem] }),
      ).toBeSuccessfulCommand();

      // Now "Now That's Not Bad" should have triggered since an item was banished
      const bagEffects2 = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects2.length).toBeGreaterThanOrEqual(1);
    });

    it("draws a card and then requires discard when accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [archimedesResourcefulOwl],
          deck: 3,
          inkwell: 3,
        },
        {
          play: [opponentItem],
        },
      );

      expect(testEngine.asPlayerOne().playCard(archimedesResourcefulOwl)).toBeSuccessfulCommand();

      // Accept banish item ability
      const [banishBag] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(archimedesResourcefulOwl, { targets: [opponentItem] }),
      ).toBeSuccessfulCommand();

      // Accept draw+discard ability
      const [drawDiscardBag] = testEngine.asPlayerOne().getBagEffects();
      expect(drawDiscardBag).toBeDefined();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(archimedesResourcefulOwl),
      ).toBeSuccessfulCommand();

      // Drew 1 card from deck (started at 3), then discarded 1 from hand
      // Deck should be 2, hand should be 0 (drew 1, discarded 1)
      expect(testEngine.asPlayerOne()).toHaveZoneCounts({ deck: 2 });
    });

    it("does not trigger when an item is banished during opponent's turn", () => {
      const secondArchimedes: typeof archimedesResourcefulOwl = {
        ...archimedesResourcefulOwl,
        id: "archimedes-2",
        canonicalId: "ci_archimedes-2",
      };

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [archimedesResourcefulOwl],
          deck: 3,
        },
        {
          hand: [secondArchimedes],
          play: [opponentItem],
          inkwell: 3,
        },
      );

      // Pass to player 2's turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Player 2 plays their own Archimedes, which banishes opponentItem
      expect(testEngine.asPlayerTwo().playCard(secondArchimedes)).toBeSuccessfulCommand();
      const bagEffects = testEngine.asPlayerTwo().getBagEffects();
      // Player 2's Archimedes triggers "You Don't Need That"
      const banishBag = bagEffects.find(
        (b: { controllerId: string }) => b.controllerId === "player_two",
      );
      expect(banishBag).toBeDefined();
      expect(
        testEngine
          .asPlayerTwo()
          .resolvePendingByCard(secondArchimedes, { targets: [opponentItem] }),
      ).toBeSuccessfulCommand();

      // Player 1's Archimedes should NOT have triggered (not during player 1's turn)
      // Player 2's Archimedes may have its own trigger, but no effects should be for player 1
      const player1BagEffects = testEngine
        .asPlayerOne()
        .getBagEffects()
        .filter((b: { controllerId: string }) => b.controllerId === "player_one");
      expect(player1BagEffects.length).toBe(0);
    });

    it("does not trigger or draw when the optional is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [archimedesResourcefulOwl],
          deck: 3,
          inkwell: 3,
        },
        {
          play: [opponentItem],
        },
      );

      expect(testEngine.asPlayerOne().playCard(archimedesResourcefulOwl)).toBeSuccessfulCommand();

      // Accept banish item
      const [banishBag] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(archimedesResourcefulOwl, { targets: [opponentItem] }),
      ).toBeSuccessfulCommand();

      // Decline draw+discard
      const [drawDiscardBag] = testEngine.asPlayerOne().getBagEffects();
      expect(drawDiscardBag).toBeDefined();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(archimedesResourcefulOwl, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Deck should remain at 3 (no draw happened)
      expect(testEngine.asPlayerOne()).toHaveZoneCounts({ deck: 3 });
    });

    // TODO: requires manualBanish method on LorcanaServer
    // it("regression: second ability does NOT trigger when opponent banishes an item on their turn", () => {
    //   // Archimedes is on P1. P2 has an item-banishing ability.
    //   // When P2 banishes their own item during P2's turn, Archimedes on P1 should NOT trigger.
    //   const p2Item = createMockItem({
    //     id: "archimedes-p2-item",
    //     name: "P2 Item",
    //     cost: 1,
    //   });

    //   const itemBanisher = createMockCharacter({
    //     id: "archimedes-item-banisher",
    //     name: "Item Banisher",
    //     cost: 2,
    //     strength: 2,
    //     willpower: 2,
    //   });

    //   const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
    //     {
    //       play: [archimedesResourcefulOwl],
    //       deck: 3,
    //     },
    //     {
    //       play: [p2Item],
    //       deck: 3,
    //     },
    //   );

    //   // Pass to P2's turn
    //   expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    //   // P2 manually banishes their own item (simulating an ability that banishes items)
    //   testEngine.asServer().manualBanish(p2Item);

    //   // Archimedes on P1 should NOT have any triggered effects (it's not P1's turn)
    //   const p1BagEffects = testEngine
    //     .asPlayerOne()
    //     .getBagEffects()
    //     .filter((b: { controllerId: string }) => b.controllerId === "player_one");
    //   expect(p1BagEffects.length).toBe(0);
    // });
  });
});
