/**
 * Spec 8: Bag & Game State Check Test Suite
 *
 * Tests for the Bag system and Game State Check procedures.
 */

import { describe, expect, it } from "bun:test";
import type {
  GameEvent,
  TriggeredAbilityInstance,
} from "../abilities/ability-types";
import {
  addTriggeredAbilityToBag,
  type BagEntry,
  type BagState,
  checkLossConditions,
  // Game State Check
  checkWinConditions,
  chooseToResolve,
  clearBag,
  completeResolution,
  // Bag
  createBagEntry,
  createEmptyBagState,
  determineGameEnd,
  getBagEntriesForPlayer,
  getBagSize,
  getCardsExceedingWillpower,
  getEntry,
  getLoser,
  getNextResolvableEntries,
  getResolvableEntries,
  getWinner,
  hasEntry,
  isBagEmpty,
  isGameOver,
  mustResolveBag,
  performGameStateCheck,
  removeFromBag,
  shouldBanish,
} from "../systems";
import type { LorcanaCardDefinition } from "../types/card-types";
import type { CardId, PlayerId } from "../types/game-state";
import {
  addDamage,
  clearDrying,
  createCardInstanceState,
} from "../zones/card-state";

const player1 = "player1" as PlayerId;
const player2 = "player2" as PlayerId;
const cardId = (id: string): CardId => id as CardId;

// Helper to create mock cards
function createMockCard(
  overrides: Partial<LorcanaCardDefinition> = {},
): LorcanaCardDefinition {
  return {
    id: `card-${Math.random().toString(36).slice(2)}`,
    name: "Test Card",
    version: "Test Version",
    fullName: "Test Card - Test Version",
    inkType: ["amber"],
    cost: 3,
    inkable: true,
    cardType: "character",
    strength: 2,
    willpower: 3,
    lore: 1,
    set: "TFC",
    ...overrides,
  };
}

// Helper to create ready, dry state
function createReadyDryState(id: string) {
  return clearDrying(createCardInstanceState(cardId(id)));
}

// Sample triggered ability instance
function createSampleAbility(
  sourceId: string,
  controllerId: PlayerId,
): TriggeredAbilityInstance {
  return {
    instanceId: `instance-${sourceId}`,
    sourceCardId: cardId(sourceId),
    controllerId,
    ability: {
      type: "triggered",
      id: "test-ability",
      text: "Test ability",
      trigger: { type: "whenPlayed" },
      effect: { type: "drawCards", params: { count: 1 } },
    },
    isOptional: false,
  };
}

describe("Spec 8: Bag & Game State Check", () => {
  describe("The Bag (Rule 1.7, 8.7)", () => {
    it("starts empty", () => {
      const bag = createEmptyBagState();
      expect(isBagEmpty(bag)).toBe(true);
      expect(getBagSize(bag)).toBe(0);
    });

    it("triggered abilities go into the bag", () => {
      let bag = createEmptyBagState();
      const ability = createSampleAbility("card1", player1);
      const event: GameEvent = {
        type: "cardPlayed",
        sourceCardId: cardId("card1"),
      };

      bag = addTriggeredAbilityToBag(bag, ability, event);

      expect(isBagEmpty(bag)).toBe(false);
      expect(getBagSize(bag)).toBe(1);
    });

    it("creates bag entry with correct properties", () => {
      const ability = createSampleAbility("card1", player1);
      const event: GameEvent = { type: "cardPlayed" };

      const entry = createBagEntry(ability, cardId("card1"), player1, event);

      expect(entry.sourceCardId).toBe(cardId("card1"));
      expect(entry.controllerId).toBe(player1);
      expect(entry.triggerEvent).toBe(event);
      expect(entry.id).toBeDefined();
    });

    it("can have multiple abilities from both players", () => {
      let bag = createEmptyBagState();
      const event: GameEvent = { type: "cardPlayed" };

      bag = addTriggeredAbilityToBag(
        bag,
        createSampleAbility("c1", player1),
        event,
      );
      bag = addTriggeredAbilityToBag(
        bag,
        createSampleAbility("c2", player1),
        event,
      );
      bag = addTriggeredAbilityToBag(
        bag,
        createSampleAbility("c3", player2),
        event,
      );

      expect(getBagSize(bag)).toBe(3);
      expect(getBagEntriesForPlayer(bag, player1)).toHaveLength(2);
      expect(getBagEntriesForPlayer(bag, player2)).toHaveLength(1);
    });

    it("removes entry from bag", () => {
      let bag = createEmptyBagState();
      const event: GameEvent = { type: "cardPlayed" };
      bag = addTriggeredAbilityToBag(
        bag,
        createSampleAbility("c1", player1),
        event,
      );

      const entryId = bag.entries[0].id;
      bag = removeFromBag(bag, entryId);

      expect(isBagEmpty(bag)).toBe(true);
      expect(bag.resolutionOrder).toContain(entryId);
    });

    it("clears all entries from bag", () => {
      let bag = createEmptyBagState();
      const event: GameEvent = { type: "cardPlayed" };
      bag = addTriggeredAbilityToBag(
        bag,
        createSampleAbility("c1", player1),
        event,
      );
      bag = addTriggeredAbilityToBag(
        bag,
        createSampleAbility("c2", player1),
        event,
      );

      bag = clearBag(bag);

      expect(isBagEmpty(bag)).toBe(true);
    });
  });

  describe("Bag Resolution Order", () => {
    it("active player chooses from available entries", () => {
      let bag = createEmptyBagState();
      const event: GameEvent = { type: "cardPlayed" };
      bag = addTriggeredAbilityToBag(
        bag,
        createSampleAbility("c1", player1),
        event,
      );
      bag = addTriggeredAbilityToBag(
        bag,
        createSampleAbility("c2", player2),
        event,
      );

      const resolvable = getResolvableEntries(bag);

      expect(resolvable).toHaveLength(2);
    });

    it("own and opponent's triggers can both be in bag", () => {
      let bag = createEmptyBagState();
      const event: GameEvent = { type: "cardPlayed" };
      bag = addTriggeredAbilityToBag(
        bag,
        createSampleAbility("c1", player1),
        event,
      );
      bag = addTriggeredAbilityToBag(
        bag,
        createSampleAbility("c2", player2),
        event,
      );

      expect(getBagEntriesForPlayer(bag, player1)).toHaveLength(1);
      expect(getBagEntriesForPlayer(bag, player2)).toHaveLength(1);
    });

    it("chooses and starts resolving an entry", () => {
      let bag = createEmptyBagState();
      const event: GameEvent = { type: "cardPlayed" };
      bag = addTriggeredAbilityToBag(
        bag,
        createSampleAbility("c1", player1),
        event,
      );

      const entryId = bag.entries[0].id;
      bag = chooseToResolve(bag, entryId);

      expect(bag.currentlyResolving).not.toBe(null);
      if (bag.currentlyResolving) {
        expect(bag.currentlyResolving.id).toBe(entryId);
      }
      expect(bag.entries).toHaveLength(0);
    });

    it("completes resolution and tracks history", () => {
      let bag = createEmptyBagState();
      const event: GameEvent = { type: "cardPlayed" };
      bag = addTriggeredAbilityToBag(
        bag,
        createSampleAbility("c1", player1),
        event,
      );

      const entryId = bag.entries[0].id;
      bag = chooseToResolve(bag, entryId);
      bag = completeResolution(bag);

      expect(bag.currentlyResolving).toBe(null);
      expect(bag.resolutionOrder).toContain(entryId);
    });

    it("cannot choose another while one is resolving", () => {
      let bag = createEmptyBagState();
      const event: GameEvent = { type: "cardPlayed" };
      bag = addTriggeredAbilityToBag(
        bag,
        createSampleAbility("c1", player1),
        event,
      );
      bag = addTriggeredAbilityToBag(
        bag,
        createSampleAbility("c2", player1),
        event,
      );

      const entryId = bag.entries[0].id;
      bag = chooseToResolve(bag, entryId);

      const nextResolvable = getNextResolvableEntries(bag);
      expect(nextResolvable).toHaveLength(0);
    });

    it("player cannot pass with bag entries remaining", () => {
      let bag = createEmptyBagState();
      const event: GameEvent = { type: "cardPlayed" };
      bag = addTriggeredAbilityToBag(
        bag,
        createSampleAbility("c1", player1),
        event,
      );

      expect(mustResolveBag(bag)).toBe(true);
    });

    it("hasEntry checks for specific entry", () => {
      let bag = createEmptyBagState();
      const event: GameEvent = { type: "cardPlayed" };
      bag = addTriggeredAbilityToBag(
        bag,
        createSampleAbility("c1", player1),
        event,
      );

      const entryId = bag.entries[0].id;
      expect(hasEntry(bag, entryId)).toBe(true);
      expect(hasEntry(bag, "nonexistent")).toBe(false);
    });

    it("getEntry retrieves specific entry", () => {
      let bag = createEmptyBagState();
      const event: GameEvent = { type: "cardPlayed" };
      bag = addTriggeredAbilityToBag(
        bag,
        createSampleAbility("c1", player1),
        event,
      );

      const entryId = bag.entries[0].id;
      const entry = getEntry(bag, entryId);

      expect(entry).toBeDefined();
      if (entry) {
        expect(entry.id).toBe(entryId);
      }
    });
  });

  describe("Game State Check (Rule 1.9)", () => {
    it("checks win conditions first", () => {
      const result = performGameStateCheck(
        [player1, player2],
        { [player1]: 20, [player2]: 15 },
        { [player1]: 30, [player2]: 30 },
        {}, // No pending draws
        [], // No concedes
        [], // No cards in play
      );

      expect(result.winConditions).toHaveLength(1);
      expect(result.winConditions[0].playerId).toBe(player1);
    });

    it("checks loss conditions", () => {
      const result = performGameStateCheck(
        [player1, player2],
        { [player1]: 10, [player2]: 10 },
        { [player1]: 0, [player2]: 30 }, // Player 1 deck empty
        { [player1]: 1, [player2]: 0 }, // Player 1 needs to draw
        [],
        [],
      );

      expect(result.lossConditions).toHaveLength(1);
      expect(result.lossConditions[0].playerId).toBe(player1);
      expect(result.lossConditions[0].reason).toBe("deck_out");
    });

    it("checks damage vs willpower for banishment", () => {
      const card = createMockCard({ willpower: 3 });
      const state = addDamage(createReadyDryState("c1"), 3);

      const result = performGameStateCheck(
        [player1, player2],
        { [player1]: 10, [player2]: 10 },
        { [player1]: 30, [player2]: 30 },
        {},
        [],
        [{ cardId: cardId("c1"), card, state }],
      );

      expect(result.requiredActions).toHaveLength(1);
      expect(result.requiredActions[0].type).toBe("banish");
    });
  });

  describe("Win Condition: 20 Lore (Rule 3.2.1.1)", () => {
    it("player wins at exactly 20 lore", () => {
      const wins = checkWinConditions([player1, player2], {
        [player1]: 20,
        [player2]: 15,
      });

      expect(wins).toHaveLength(1);
      expect(wins[0].playerId).toBe(player1);
      expect(wins[0].lore).toBe(20);
    });

    it("player wins at more than 20 lore", () => {
      const wins = checkWinConditions([player1, player2], {
        [player1]: 25,
        [player2]: 15,
      });

      expect(wins).toHaveLength(1);
      expect(wins[0].lore).toBe(25);
    });

    it("both players can have win conditions simultaneously", () => {
      const wins = checkWinConditions([player1, player2], {
        [player1]: 20,
        [player2]: 22,
      });

      expect(wins).toHaveLength(2);
    });
  });

  describe("Loss Condition: Empty Deck (Rule 3.2.1.2)", () => {
    it("player loses when trying to draw from empty deck", () => {
      const losses = checkLossConditions(
        [player1, player2],
        { [player1]: 0, [player2]: 30 },
        { [player1]: 1, [player2]: 0 },
        [],
      );

      expect(losses).toHaveLength(1);
      expect(losses[0].reason).toBe("deck_out");
    });

    it("having empty deck alone doesn't cause loss", () => {
      const losses = checkLossConditions(
        [player1, player2],
        { [player1]: 0, [player2]: 30 },
        { [player1]: 0, [player2]: 0 }, // No pending draws
        [],
      );

      expect(losses).toHaveLength(0);
    });

    it("concede causes loss", () => {
      const losses = checkLossConditions(
        [player1, player2],
        { [player1]: 30, [player2]: 30 },
        {},
        [player1],
      );

      expect(losses).toHaveLength(1);
      expect(losses[0].reason).toBe("concede");
    });
  });

  describe("Banishment Check (Rule 1.9.3)", () => {
    it("banishes character when damage >= willpower", () => {
      const card = createMockCard({ willpower: 3 });
      const state = addDamage(createReadyDryState("c1"), 3);

      expect(shouldBanish(card, state)).toBe(true);
    });

    it("banishes when damage equals willpower exactly", () => {
      const card = createMockCard({ willpower: 5 });
      const state = addDamage(createReadyDryState("c1"), 5);

      expect(shouldBanish(card, state)).toBe(true);
    });

    it("does not banish when damage < willpower", () => {
      const card = createMockCard({ willpower: 5 });
      const state = addDamage(createReadyDryState("c1"), 4);

      expect(shouldBanish(card, state)).toBe(false);
    });

    it("location also follows damage >= willpower rule", () => {
      const location = createMockCard({
        cardType: "location",
        willpower: 4,
      });
      const state = addDamage(createReadyDryState("loc1"), 4);

      expect(shouldBanish(location, state)).toBe(true);
    });

    it("multiple cards can be marked for banishment", () => {
      const cards = [
        {
          cardId: cardId("c1"),
          card: createMockCard({ willpower: 3 }),
          state: addDamage(createReadyDryState("c1"), 5),
        },
        {
          cardId: cardId("c2"),
          card: createMockCard({ willpower: 4 }),
          state: addDamage(createReadyDryState("c2"), 4),
        },
        {
          cardId: cardId("c3"),
          card: createMockCard({ willpower: 5 }),
          state: addDamage(createReadyDryState("c3"), 2),
        },
      ];

      const actions = getCardsExceedingWillpower(cards);

      expect(actions).toHaveLength(2);
      expect(actions.map((a) => a.cardId)).toContain(cardId("c1"));
      expect(actions.map((a) => a.cardId)).toContain(cardId("c2"));
    });
  });

  describe("Game End Determination", () => {
    it("win takes priority over loss", () => {
      const result: ReturnType<typeof performGameStateCheck> = {
        winConditions: [
          { playerId: player1, reason: "lore_victory", lore: 20 },
        ],
        lossConditions: [{ playerId: player1, reason: "deck_out" }],
        requiredActions: [],
        newTriggers: [],
      };

      const endState = determineGameEnd(result, [player1, player2]);

      expect(endState.isOver).toBe(true);
      expect(endState.winner).toBe(player1);
      expect(endState.reason?.type).toBe("LORE_VICTORY");
    });

    it("determines winner from lore victory", () => {
      const result: ReturnType<typeof performGameStateCheck> = {
        winConditions: [
          { playerId: player2, reason: "lore_victory", lore: 22 },
        ],
        lossConditions: [],
        requiredActions: [],
        newTriggers: [],
      };

      const endState = determineGameEnd(result, [player1, player2]);

      expect(getWinner(endState)).toBe(player2);
      expect(getLoser(endState)).toBe(player1);
    });

    it("determines loser from deck out", () => {
      const result: ReturnType<typeof performGameStateCheck> = {
        winConditions: [],
        lossConditions: [{ playerId: player1, reason: "deck_out" }],
        requiredActions: [],
        newTriggers: [],
      };

      const endState = determineGameEnd(result, [player1, player2]);

      expect(isGameOver(endState)).toBe(true);
      expect(getLoser(endState)).toBe(player1);
      expect(getWinner(endState)).toBe(player2);
      expect(endState.reason?.type).toBe("DECK_OUT");
    });

    it("game continues when no win/loss conditions", () => {
      const result: ReturnType<typeof performGameStateCheck> = {
        winConditions: [],
        lossConditions: [],
        requiredActions: [],
        newTriggers: [],
      };

      const endState = determineGameEnd(result, [player1, player2]);

      expect(isGameOver(endState)).toBe(false);
      expect(getWinner(endState)).toBeNull();
      expect(getLoser(endState)).toBeNull();
    });
  });

  describe("Floating Triggers", () => {
    it("bag entry can have source card snapshot", () => {
      const ability = createSampleAbility("card1", player1);
      const card = createMockCard({ name: "Snapshot Card" });
      const event: GameEvent = { type: "cardBanished" };

      const entry = createBagEntry(
        ability,
        cardId("card1"),
        player1,
        event,
        card,
      );

      expect(entry.sourceCardSnapshot).toBeDefined();
      if (entry.sourceCardSnapshot) {
        expect(entry.sourceCardSnapshot.name).toBe("Snapshot Card");
      }
    });
  });
});
