import { beforeEach, describe, expect, it, mock } from "bun:test";
import { AlphaClashCoreOperations } from "../alpha-clash-core-operations";

// Mock state and dependencies
const mockState = {
  ctx: {
    cardMetas: {},
    playerOrder: ["player1", "player2"],
    priorityPlayerPos: 0,
    turnPlayerPos: 0,
    gameId: "test-game",
    matchId: "test-match",
    numTurns: 0,
    numMoves: 0,
    numTurnMoves: 0,
    cards: {},
    moveHistory: [],
    players: {},
  },
};

// Mock AlphaClash engine
const mockEngine = {
  cardInstanceStore: {
    getCardByInstanceId: mock(() => ({
      instanceId: "card-1",
      card: { id: "card-1" },
    })),
  },
  queryCards: mock(() => []),
  getCardsInZone: mock(() => []),
  getCardOwner: mock(() => "player1"),
  getCardZone: mock(() => "hand"),
  getCardsByFilter: mock(() => [
    { instanceId: "card-1", definition: { id: "card-1" }, zone: "play" },
    { instanceId: "card-2", definition: { id: "card-2" }, zone: "play" },
  ]),
};

describe("AlphaClashCoreOperations", () => {
  let coreOps: AlphaClashCoreOperations;

  beforeEach(() => {
    // Reset the mocks and state
    mockState.ctx.cardMetas = {};

    // Create a new instance for each test
    coreOps = new AlphaClashCoreOperations({
      state: mockState as any,
      engine: mockEngine as any,
    });
  });

  describe("Card Status Operations", () => {
    it("should set card status", () => {
      coreOps.setCardStatus("card-1", "engaged");
      expect(mockState.ctx.cardMetas["card-1"].status).toBe("engaged");
    });
  });

  describe("Damage Operations", () => {
    it("should apply damage to a card", () => {
      // Apply damage
      coreOps.applyDamage("card-1", 3);

      // Verify damage was applied
      expect(mockState.ctx.cardMetas["card-1"].damage).toBe(3);
      expect(mockState.ctx.cardMetas["card-1"].damageType).toBe("clash");

      // Apply more damage with a different type
      coreOps.applyDamage("card-1", 2, "non-clash");

      // Verify damage was accumulated and type was updated
      expect(mockState.ctx.cardMetas["card-1"].damage).toBe(5);
      expect(mockState.ctx.cardMetas["card-1"].damageType).toBe("non-clash");
    });

    it("should remove damage from a card", () => {
      // Apply damage first
      coreOps.applyDamage("card-1", 5);

      // Remove some damage
      coreOps.removeDamage("card-1", 2);

      // Verify damage was reduced
      expect(mockState.ctx.cardMetas["card-1"].damage).toBe(3);

      // Remove more damage than exists
      coreOps.removeDamage("card-1", 5);

      // Verify damage can't go below 0
      expect(mockState.ctx.cardMetas["card-1"].damage).toBe(0);
    });

    it("should clear all damage", () => {
      // Apply damage first
      coreOps.applyDamage("card-1", 5);

      // Clear damage
      coreOps.clearDamage("card-1");

      // Verify damage was cleared
      expect(mockState.ctx.cardMetas["card-1"].damage).toBe(0);
    });
  });

  describe("Counter Operations", () => {
    it("should add counters to a card", () => {
      // Add counters
      coreOps.addCounter("card-1", "charge", 3);

      // Verify counters were added
      expect(mockState.ctx.cardMetas["card-1"].counters).toEqual({ charge: 3 });

      // Add more of the same counter
      coreOps.addCounter("card-1", "charge", 2);

      // Verify counters accumulated
      expect(mockState.ctx.cardMetas["card-1"].counters.charge).toBe(5);

      // Add a different counter
      coreOps.addCounter("card-1", "shield", 1);

      // Verify both counters exist
      expect(mockState.ctx.cardMetas["card-1"].counters).toEqual({
        charge: 5,
        shield: 1,
      });
    });

    it("should remove counters from a card", () => {
      // Add counters first
      coreOps.addCounter("card-1", "charge", 5);
      coreOps.addCounter("card-1", "shield", 2);

      // Remove some counters
      coreOps.removeCounter("card-1", "charge", 2);

      // Verify counters were reduced
      expect(mockState.ctx.cardMetas["card-1"].counters.charge).toBe(3);
      expect(mockState.ctx.cardMetas["card-1"].counters.shield).toBe(2);

      // Remove all of a counter type
      coreOps.removeCounter("card-1", "charge", 3);

      // Verify counter was removed completely
      expect(mockState.ctx.cardMetas["card-1"].counters.charge).toBeUndefined();
      expect(mockState.ctx.cardMetas["card-1"].counters.shield).toBe(2);
    });
  });

  describe("Modifier Operations", () => {
    it("should add modifiers to a card", () => {
      // Add a modifier
      coreOps.addModifier(
        "card-1",
        "spell-123",
        "+2 attack",
        "until end of turn",
      );

      // Verify modifier was added
      expect(mockState.ctx.cardMetas["card-1"].modifiers).toHaveLength(1);
      expect(mockState.ctx.cardMetas["card-1"].modifiers[0]).toEqual({
        source: "spell-123",
        effect: "+2 attack",
        duration: "until end of turn",
      });

      // Add another modifier
      coreOps.addModifier(
        "card-1",
        "aura-456",
        "can't attack",
        "while this card is in play",
      );

      // Verify both modifiers exist
      expect(mockState.ctx.cardMetas["card-1"].modifiers).toHaveLength(2);
    });

    it("should remove modifiers from a card by source", () => {
      // Add modifiers from different sources
      coreOps.addModifier(
        "card-1",
        "spell-123",
        "+2 attack",
        "until end of turn",
      );
      coreOps.addModifier(
        "card-1",
        "spell-123",
        "must attack",
        "until end of turn",
      );
      coreOps.addModifier(
        "card-1",
        "aura-456",
        "can't attack",
        "while this card is in play",
      );

      // Remove modifiers from one source
      coreOps.removeModifiersBySource("card-1", "spell-123");

      // Verify only modifiers from that source were removed
      expect(mockState.ctx.cardMetas["card-1"].modifiers).toHaveLength(1);
      expect(mockState.ctx.cardMetas["card-1"].modifiers[0].source).toBe(
        "aura-456",
      );
    });
  });

  describe("Attachment Operations", () => {
    it("should attach a card to another card", () => {
      // Attach card-2 to card-1
      coreOps.attachCard("card-2", "card-1");

      // Verify attachment relationship was established
      expect(mockState.ctx.cardMetas["card-2"].attachedTo).toBe("card-1");
      expect(mockState.ctx.cardMetas["card-1"].attachments).toContain("card-2");
    });

    it("should detach a card", () => {
      // Set up an attachment
      coreOps.attachCard("card-2", "card-1");

      // Detach the card
      coreOps.detachCard("card-2");

      // Verify attachment relationship was removed
      expect(mockState.ctx.cardMetas["card-2"].attachedTo).toBeUndefined();
      expect(mockState.ctx.cardMetas["card-1"].attachments).not.toContain(
        "card-2",
      );
    });
  });

  describe("Turn Tracking Operations", () => {
    it("should mark cards with turn flags", () => {
      // Mark card as played
      coreOps.markAsPlayed("card-1");
      expect(mockState.ctx.cardMetas["card-1"].playedThisTurn).toBe(true);

      // Mark card as activated
      coreOps.markAsActivated("card-1");
      expect(mockState.ctx.cardMetas["card-1"].activatedThisTurn).toBe(true);

      // Mark card as attacked
      coreOps.markAsAttacked("card-1");
      expect(mockState.ctx.cardMetas["card-1"].attackedThisTurn).toBe(true);
    });
  });
});
