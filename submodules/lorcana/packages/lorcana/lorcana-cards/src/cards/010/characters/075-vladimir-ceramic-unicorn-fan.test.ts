import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockItem,
  createMockCharacter,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/lorcana-engine/testing";
import { vladimirCeramicUnicornFan } from "./075-vladimir-ceramic-unicorn-fan";

const ownItem = createMockItem({
  id: "vladimir-test-own-item",
  name: "Own Item",
  cost: 2,
});

const anotherItem = createMockItem({
  id: "vladimir-test-another-item",
  name: "Another Item",
  cost: 3,
});

const opponentItem = createMockItem({
  id: "vladimir-test-opponent-item",
  name: "Opponent Item",
  cost: 2,
});

const anotherCharacter = createMockCharacter({
  id: "vladimir-test-another-character",
  name: "Another Character",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
});

describe("Vladimir - Ceramic Unicorn Fan", () => {
  describe("HIGH STANDARDS - Whenever this character quests, you may banish chosen item.", () => {
    it("triggers a bag effect when Vladimir quests and items are in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [vladimirCeramicUnicornFan, ownItem],
        },
        {},
      );

      expect(testEngine.asPlayerOne().quest(vladimirCeramicUnicornFan)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
    });

    it("banishes own item when ability is accepted and item is chosen", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [vladimirCeramicUnicornFan, ownItem],
        },
        {},
      );

      expect(testEngine.asPlayerOne().getCardZone(ownItem)).toBe("play");

      expect(testEngine.asPlayerOne().quest(vladimirCeramicUnicornFan)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(vladimirCeramicUnicornFan, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      const ownItemId = testEngine.findCardInstanceId(ownItem, "play", PLAYER_ONE);
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [ownItemId] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(ownItem)).toBe("discard");
    });

    it("banishes opponent's item when chosen", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [vladimirCeramicUnicornFan],
        },
        {
          play: [opponentItem],
        },
      );

      expect(testEngine.asPlayerTwo().getCardZone(opponentItem)).toBe("play");

      expect(testEngine.asPlayerOne().quest(vladimirCeramicUnicornFan)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(vladimirCeramicUnicornFan, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      const opponentItemId = testEngine.findCardInstanceId(opponentItem, "play", PLAYER_TWO);
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [opponentItemId] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(opponentItem)).toBe("discard");
    });

    it("allows choosing which item to banish when multiple items are in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [vladimirCeramicUnicornFan, ownItem, anotherItem],
        },
        {},
      );

      expect(testEngine.asPlayerOne().quest(vladimirCeramicUnicornFan)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(vladimirCeramicUnicornFan, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Choose to banish the second item
      const anotherItemId = testEngine.findCardInstanceId(anotherItem, "play", PLAYER_ONE);
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [anotherItemId] }),
      ).toBeSuccessfulCommand();

      // Only the chosen item is banished
      expect(testEngine.asPlayerOne().getCardZone(ownItem)).toBe("play");
      expect(testEngine.asPlayerOne().getCardZone(anotherItem)).toBe("discard");
    });

    it("ability is optional — can be declined and item remains in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [vladimirCeramicUnicornFan, ownItem],
        },
        {},
      );

      expect(testEngine.asPlayerOne().quest(vladimirCeramicUnicornFan)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(vladimirCeramicUnicornFan, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Item should remain in play since ability was declined
      expect(testEngine.asPlayerOne().getCardZone(ownItem)).toBe("play");
    });

    it("exerts Vladimir after questing", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [vladimirCeramicUnicornFan, ownItem],
        },
        {},
      );

      expect(testEngine.asPlayerOne().quest(vladimirCeramicUnicornFan)).toBeSuccessfulCommand();

      // Vladimir should be exerted after questing
      expect(testEngine.isExerted(vladimirCeramicUnicornFan)).toBe(true);
    });

    it("only banishes items, not characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [vladimirCeramicUnicornFan, anotherCharacter],
        },
        {},
      );

      expect(testEngine.asPlayerOne().quest(vladimirCeramicUnicornFan)).toBeSuccessfulCommand();

      // If there are no items, the bag effect may still appear (optional) but no valid targets for items
      const bagCount = testEngine.asPlayerOne().getBagCount();
      if (bagCount > 0) {
        const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
        // Accept the optional
        expect(
          testEngine
            .asPlayerOne()
            .resolvePendingByCard(vladimirCeramicUnicornFan, { resolveOptional: true }),
        ).toBeSuccessfulCommand();
      }

      // The character should not be banished
      expect(testEngine.asPlayerOne().getCardZone(anotherCharacter)).toBe("play");
    });

    it("does not trigger when Vladimir is played, only when questing", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [vladimirCeramicUnicornFan],
          inkwell: vladimirCeramicUnicornFan.cost,
          play: [ownItem],
        },
        {},
      );

      expect(testEngine.asPlayerOne().playCard(vladimirCeramicUnicornFan)).toBeSuccessfulCommand();

      // No bag effect should appear when just playing the card
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getCardZone(ownItem)).toBe("play");
    });

    it("gains lore for the player when Vladimir quests", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [vladimirCeramicUnicornFan],
        },
        {},
      );

      const loreBefore = testEngine.asPlayerOne().getLore(PLAYER_ONE);

      expect(testEngine.asPlayerOne().quest(vladimirCeramicUnicornFan)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(
        loreBefore + vladimirCeramicUnicornFan.lore,
      );
    });
  });
});
