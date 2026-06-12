/**
 * Zone Operations Tests
 *
 * Tests for ctx.zones API per PLAN.md Phase 2
 */

import { describe, it, expect } from "bun:test";
import { create } from "mutative";
import { createPlayerId } from "../types";
import {
  createZoneOperations as createRawZoneOperations,
  performMulligan as performRawMulligan,
  expireReveals,
  type MulliganResult,
} from "./zone-operations";
import { createInitialTCGCtx } from "./types";
import type { GameEvent, MatchState, ZoneRuntimeDef } from "./types";

const testZoneDefs: Record<string, ZoneRuntimeDef> = {
  deck: {
    id: "deck",
    name: "Deck",
    visibility: "secret",
    ordered: true,
    ownerScoped: true,
  },
  hand: {
    id: "hand",
    name: "Hand",
    visibility: "private",
    ordered: false,
    ownerScoped: true,
  },
  play: {
    id: "play",
    name: "Play Area",
    visibility: "public",
    ordered: true,
    ownerScoped: false,
  },
  discard: {
    id: "discard",
    name: "Discard",
    visibility: "public",
    ordered: true,
    ownerScoped: false,
  },
};

function createTestZoneRegistry() {
  return { ...testZoneDefs };
}

function createZoneOperations(
  state: Parameters<typeof createRawZoneOperations>[0],
  emitEvent?: Parameters<typeof createRawZoneOperations>[2],
  options?: Parameters<typeof createRawZoneOperations>[3],
) {
  return createRawZoneOperations(state, createTestZoneRegistry(), emitEvent, options);
}

function performMulligan(
  draft: Parameters<typeof performRawMulligan>[0],
  playerId: string,
  handZoneId: string,
  deckZoneId: string,
  handSize: number,
  remainingMulligans: number,
  emitEvent?: (event: GameEvent) => void,
) {
  return performRawMulligan(
    draft,
    createTestZoneRegistry(),
    playerId,
    handZoneId,
    deckZoneId,
    handSize,
    remainingMulligans,
    emitEvent,
  );
}

function createTestState() {
  const ctx = createInitialTCGCtx({
    matchID: "match-123",
    gameID: "lorcana",
    rulesetHash: "ruleset-v1",
  });

  ctx.zones.public.zoneSummaries = {
    deck: { revision: 0, count: 0 },
    hand: { revision: 0, count: 0 },
    play: { revision: 0, count: 0 },
    discard: { revision: 0, count: 0 },
  };
  ctx.zones.private.zoneCards = {
    deck: [],
    hand: [],
    play: [],
    discard: [],
  };

  // Add some cards to deck
  for (let i = 1; i <= 40; i++) {
    const cardId = `card-${i}`;
    ctx.zones.private.zoneCards.deck.push(cardId);
    ctx.zones.private.cardIndex[cardId] = {
      zoneKey: "deck",
      ownerID: i <= 20 ? createPlayerId("p1") : createPlayerId("p2"),
      controllerID: i <= 20 ? createPlayerId("p1") : createPlayerId("p2"),
    };
  }

  ctx.zones.public.zoneSummaries.deck.count = 40;

  return {
    G: { turn: 1 } as any,
    ctx,
  };
}

describe("Zone Operations", () => {
  describe("moveCard", () => {
    it("should move card between zones", () => {
      const state = createTestState();

      const newState = create(state, (draft) => {
        const ops = createZoneOperations(draft);
        ops.moveCard("card-1", { zone: "hand", playerId: "p1" });
      });

      expect(newState.ctx.zones.private.zoneCards.deck).not.toContain("card-1");
      expect(newState.ctx.zones.private.zoneCards.hand).toContain("card-1");
      expect(newState.ctx.zones.private.cardIndex["card-1"].zoneKey).toBe("hand");
    });

    it("should maintain card metadata when moving", () => {
      const state = createTestState();
      state.ctx.zones.private.cardMeta["card-1"] = { tapped: true, damage: 2 };

      const newState = create(state, (draft) => {
        const ops = createZoneOperations(draft);
        ops.moveCard("card-1", { zone: "play" });
      });

      expect(newState.ctx.zones.private.cardMeta["card-1"]).toEqual({ tapped: true, damage: 2 });
    });

    it("should update zone summaries", () => {
      const state = createTestState();

      const newState = create(state, (draft) => {
        const ops = createZoneOperations(draft);
        ops.moveCard("card-1", { zone: "hand", playerId: "p1" });
      });

      expect(newState.ctx.zones.public.zoneSummaries.deck.count).toBe(39);
      expect(newState.ctx.zones.public.zoneSummaries.deck.revision).toBe(1);
      expect(newState.ctx.zones.public.zoneSummaries.hand.count).toBe(1);
    });

    it("should insert at specific index for ordered zones", () => {
      const state = createTestState();

      const newState = create(state, (draft) => {
        const ops = createZoneOperations(draft);
        ops.moveCard("card-1", { zone: "play" }, { index: 0 });
        ops.moveCard("card-2", { zone: "play" }, { index: 0 });
      });

      expect(newState.ctx.zones.private.zoneCards.play).toEqual(["card-2", "card-1"]);
    });
  });

  describe("moveCards", () => {
    it("should move multiple cards at once", () => {
      const state = createTestState();

      const newState = create(state, (draft) => {
        const ops = createZoneOperations(draft);
        ops.moveCards(["card-1", "card-2", "card-3"], { zone: "hand", playerId: "p1" });
      });

      expect(newState.ctx.zones.private.zoneCards.hand).toHaveLength(3);
      expect(newState.ctx.zones.private.zoneCards.deck).toHaveLength(37);
    });
  });

  describe("drawCards", () => {
    it("should draw cards from deck to hand", () => {
      const state = createTestState();

      const newState = create(state, (draft) => {
        const ops = createZoneOperations(draft);
        const drawn = ops.drawCards({
          from: { zone: "deck", playerId: "p1" },
          to: { zone: "hand", playerId: "p1" },
          count: 5,
        });
        expect(drawn).toHaveLength(5);
      });

      expect(newState.ctx.zones.public.zoneSummaries.hand.count).toBe(5);
      expect(newState.ctx.zones.public.zoneSummaries.deck.count).toBe(35);
    });

    it("should respect player ownership when drawing", () => {
      const state = createTestState();

      const newState = create(state, (draft) => {
        const ops = createZoneOperations(draft);
        const drawn = ops.drawCards({
          from: { zone: "deck", playerId: "p1" },
          to: { zone: "hand", playerId: "p1" },
          count: 10,
        });

        // All drawn cards should belong to p1
        for (const cardId of drawn) {
          expect(draft.ctx.zones.private.cardIndex[cardId].ownerID).toBe(createPlayerId("p1"));
        }
      });

      expect(newState.ctx.zones.private.zoneCards.hand).toHaveLength(10);
    });

    it("should not draw more cards than available", () => {
      const state = createTestState();
      // Clear deck except for 3 cards
      state.ctx.zones.private.zoneCards.deck = ["card-1", "card-2", "card-3"];
      state.ctx.zones.public.zoneSummaries.deck.count = 3;

      const newState = create(state, (draft) => {
        const ops = createZoneOperations(draft);
        const drawn = ops.drawCards({
          from: { zone: "deck", playerId: "p1" },
          to: { zone: "hand", playerId: "p1" },
          count: 10,
        });
        expect(drawn).toHaveLength(3);
      });

      expect(newState.ctx.zones.private.zoneCards.deck).toHaveLength(0);
    });

    it("should draw zero cards when count is zero", () => {
      const state = createTestState();

      const newState = create(state, (draft) => {
        const ops = createZoneOperations(draft);
        const drawn = ops.drawCards({
          from: { zone: "deck", playerId: "p1" },
          to: { zone: "hand", playerId: "p1" },
          count: 0,
        });
        expect(drawn).toEqual([]);
      });

      expect(newState.ctx.zones.private.zoneCards.hand).toHaveLength(0);
      expect(newState.ctx.zones.private.zoneCards.deck).toHaveLength(40);
      expect(newState.ctx.zones.public.zoneSummaries.hand.count).toBe(0);
      expect(newState.ctx.zones.public.zoneSummaries.deck.count).toBe(40);
    });

    it("should draw from the top for owner-scoped zones", () => {
      const state = createTestState();
      const deck = state.ctx.zones.private.zoneCards.deck;
      deck.push("moved-card");
      state.ctx.zones.private.zoneCards.deck = deck;
      state.ctx.zones.private.cardIndex["moved-card"] = {
        zoneKey: "deck",
        ownerID: createPlayerId("p1"),
        controllerID: createPlayerId("p1"),
      };
      state.ctx.zones.public.zoneSummaries.deck.count = 41;

      const newState = create(state, (draft) => {
        const ops = createZoneOperations(draft);
        const drawn = ops.drawCards({
          from: { zone: "deck", playerId: "p1" },
          to: { zone: "hand", playerId: "p1" },
          count: 1,
        });

        expect(drawn).toHaveLength(1);
        expect(drawn[0]).toBe("moved-card");
      });

      expect(newState.ctx.zones.private.zoneCards.hand).toEqual(["moved-card"]);
      expect(newState.ctx.zones.private.zoneCards.deck).not.toContain("moved-card");
    });
  });

  describe("drawSpecificCard", () => {
    it("should draw specific card from deck", () => {
      const state = createTestState();

      const newState = create(state, (draft) => {
        const ops = createZoneOperations(draft);
        const success = ops.drawSpecificCard(
          "card-5",
          { zone: "deck", playerId: "p1" },
          { zone: "hand", playerId: "p1" },
        );
        expect(success).toBe(true);
      });

      expect(newState.ctx.zones.private.zoneCards.hand).toContain("card-5");
    });

    it("should return false if card not in zone", () => {
      const state = createTestState();

      create(state, (draft) => {
        const ops = createZoneOperations(draft);
        const success = ops.drawSpecificCard(
          "nonexistent",
          { zone: "deck", playerId: "p1" },
          { zone: "hand", playerId: "p1" },
        );
        expect(success).toBe(false);
      });
    });
  });

  describe("mill", () => {
    it("should mill from top of source zone to destination", () => {
      const events: import("./types").GameEvent[] = [];
      const state = createTestState();

      const newState = create(state, (draft) => {
        const ops = createZoneOperations(draft, (event) => events.push(event));
        const milled = ops.mill(
          { zone: "deck", playerId: "p1" },
          { zone: "discard", playerId: "p1" },
          3,
        );
        expect(milled).toEqual(["card-20", "card-19", "card-18"]);
      });

      expect(newState.ctx.zones.private.zoneCards.deck).toHaveLength(37);
      expect(newState.ctx.zones.private.zoneCards.discard).toEqual([
        "card-20",
        "card-19",
        "card-18",
      ]);
      expect(newState.ctx.zones.private.cardIndex["card-20"].zoneKey).toBe("discard");
      expect(newState.ctx.zones.public.zoneSummaries.deck.count).toBe(37);
      expect(newState.ctx.zones.public.zoneSummaries.discard.count).toBe(3);
      expect(events.some((e) => e.kind === "CARDS_MILLED")).toBe(true);
    });

    it("should respect owner-scoped filtering when playerId is supplied", () => {
      const state = createTestState();

      const newState = create(state, (draft) => {
        const ops = createZoneOperations(draft);
        const milled = ops.mill(
          { zone: "deck", playerId: "p2" },
          { zone: "discard", playerId: "p2" },
          2,
        );
        expect(milled).toEqual(["card-40", "card-39"]);
      });

      expect(newState.ctx.zones.private.zoneCards.discard).toEqual(["card-40", "card-39"]);
      expect(newState.ctx.zones.private.cardIndex["card-40"].ownerID).toBe(createPlayerId("p2"));
    });
  });

  describe("shuffle", () => {
    it("should shuffle cards in zone", () => {
      const state = createTestState();
      const originalOrder = [...state.ctx.zones.private.zoneCards.deck];

      const newState = create(state, (draft) => {
        const ops = createZoneOperations(draft);
        ops.shuffle({ zone: "deck", playerId: "p1" });
      });

      // Order should be different (with very high probability)
      expect(newState.ctx.zones.private.zoneCards.deck).not.toEqual(originalOrder);
      expect(newState.ctx.zones.private.zoneCards.deck).toHaveLength(originalOrder.length);
    });

    it("should shuffle only owned cards for owner-scoped zones", () => {
      const state = createTestState();

      const newState = create(state, (draft) => {
        const ops = createZoneOperations(draft);
        ops.shuffle({ zone: "deck", playerId: "p1" });
      });

      // p1's cards should be shuffled
      const p1Cards = newState.ctx.zones.private.zoneCards.deck.filter(
        (id) => newState.ctx.zones.private.cardIndex[id].ownerID === "p1",
      );
      expect(p1Cards).toHaveLength(20);
    });
  });

  describe("reveal", () => {
    it("should create reveal window for all", () => {
      const state = createTestState();

      const newState = create(state, (draft) => {
        const ops = createZoneOperations(draft);
        ops.reveal(["card-1", "card-2"], "all");
      });

      expect(newState.ctx.zones.reveals.active).toHaveLength(1);
      expect(newState.ctx.zones.reveals.active[0].cardIDs).toEqual(["card-1", "card-2"]);
      expect(newState.ctx.zones.reveals.active[0].visibleTo).toBe("all");
    });

    it("should generate deterministic reveal ids", () => {
      const state = createTestState();
      let revealIds: string[] = [];

      const newState = create(state, (draft) => {
        const ops = createZoneOperations(draft);
        revealIds = [ops.reveal(["card-1"], "all"), ops.reveal(["card-2"], ["p1"])];
      });

      expect(revealIds).toEqual(["reveal-0", "reveal-1"]);
      expect(newState.ctx.zones.reveals.nextSeq).toBe(2);
    });

    it("should create reveal window for specific players", () => {
      const state = createTestState();

      const newState = create(state, (draft) => {
        const ops = createZoneOperations(draft);
        ops.reveal(["card-1"], ["p1"]);
      });

      expect(newState.ctx.zones.reveals.active[0].visibleTo).toEqual(["p1"]);
    });

    it("should create reveal with expiration", () => {
      const state = createTestState();

      const newState = create(state, (draft) => {
        const ops = createZoneOperations(draft);
        ops.reveal(["card-1"], "all", { stateID: 10 });
      });

      expect(newState.ctx.zones.reveals.active[0].expiresAtStateID).toBe(10);
    });
  });

  describe("revealTop", () => {
    it("should reveal top cards of zone", () => {
      const state = createTestState();

      const newState = create(state, (draft) => {
        const ops = createZoneOperations(draft);
        const revealed = ops.revealTop({ zone: "deck", playerId: "p1" }, 3, "all");
        expect(revealed).toHaveLength(3);
      });

      expect(newState.ctx.zones.reveals.active).toHaveLength(1);
    });
  });

  describe("clearReveal", () => {
    it("should remove reveal window", () => {
      const state = createTestState();

      const newState = create(state, (draft) => {
        const ops = createZoneOperations(draft);
        const revealId = ops.reveal(["card-1"], "all");
        ops.clearReveal(revealId);
      });

      expect(newState.ctx.zones.reveals.active).toHaveLength(0);
    });
  });

  describe("search", () => {
    it("should find cards matching predicate", () => {
      const state = createTestState();
      state.ctx.zones.private.cardMeta["card-1"] = { type: "creature", cost: 2 };
      state.ctx.zones.private.cardMeta["card-2"] = { type: "spell", cost: 1 };
      state.ctx.zones.private.cardMeta["card-3"] = { type: "creature", cost: 3 };

      let results: string[] = [];
      create(state, (draft) => {
        const ops = createZoneOperations(draft);
        results = ops.search(
          { zone: "deck", playerId: "p1" },
          (card) => card.meta.type === "creature",
        );
      });

      expect(results).toContain("card-1");
      expect(results).toContain("card-3");
      expect(results).not.toContain("card-2");
    });
  });

  describe("searchAndPick", () => {
    it("should return limited number of matching cards", () => {
      const state = createTestState();

      let results: string[] = [];
      create(state, (draft) => {
        const ops = createZoneOperations(draft);
        results = ops.searchAndPick({ zone: "deck", playerId: "p1" }, 5);
      });

      expect(results).toHaveLength(5);
    });

    it("should apply predicate if provided", () => {
      const state = createTestState();
      state.ctx.zones.private.cardMeta["card-1"] = { rarity: "rare" };
      state.ctx.zones.private.cardMeta["card-2"] = { rarity: "common" };

      let results: string[] = [];
      create(state, (draft) => {
        const ops = createZoneOperations(draft);
        results = ops.searchAndPick(
          { zone: "deck", playerId: "p1" },
          10,
          (card) => card.meta.rarity === "rare",
        );
      });

      expect(results).toContain("card-1");
      expect(results).not.toContain("card-2");
    });
  });

  describe("lookAt / lookAtTop / lookAtBottom", () => {
    it("should reveal top cards to specific player", () => {
      const state = createTestState();

      const newState = create(state, (draft) => {
        const ops = createZoneOperations(draft);
        const looked = ops.lookAtTop({ zone: "deck", playerId: "p1" }, 3, "p1");
        expect(looked).toHaveLength(3);
      });

      expect(newState.ctx.zones.reveals.active).toHaveLength(1);
      expect(newState.ctx.zones.reveals.active[0].visibleTo).toEqual(["p1"]);
    });
  });

  describe("queries", () => {
    it("should get card count", () => {
      const state = createTestState();
      const ops = createZoneOperations(state);
      expect(ops.getCardCount({ zone: "deck", playerId: "p1" })).toBe(40);
    });

    it("should get top card", () => {
      const state = createTestState();
      const ops = createZoneOperations(state);
      expect(ops.getTopCard({ zone: "deck", playerId: "p1" })).toBe("card-40"); // Last in array
    });

    it("should get bottom card", () => {
      const state = createTestState();
      const ops = createZoneOperations(state);
      expect(ops.getBottomCard({ zone: "deck", playerId: "p1" })).toBe("card-1"); // First in array
    });

    it("should get card zone", () => {
      const state = createTestState();
      const ops = createZoneOperations(state);
      expect(ops.getCardZone("card-1")).toBe("deck");
    });

    it("should get card owner", () => {
      const state = createTestState();
      const ops = createZoneOperations(state);
      expect(ops.getCardOwner("card-1")).toBe("p1");
      expect(ops.getCardOwner("card-30")).toBe("p2");
    });

    it("should check zone properties", () => {
      const state = createTestState();
      const ops = createZoneOperations(state);

      expect(ops.isOrdered({ zone: "deck", playerId: "p1" })).toBe(true);
      expect(ops.isOrdered({ zone: "hand", playerId: "p1" })).toBe(false);
      expect(ops.isOwnerScoped({ zone: "deck", playerId: "p1" })).toBe(true);
      expect(ops.isOwnerScoped({ zone: "play" })).toBe(false);
      expect(ops.getVisibility({ zone: "deck", playerId: "p1" })).toBe("secret");
      expect(ops.getVisibility({ zone: "hand", playerId: "p1" })).toBe("private");
      expect(ops.getVisibility({ zone: "play" })).toBe("public");
    });

    it("should throw when owner-scoped zone is queried without playerId", () => {
      const state = createTestState();
      const ops = createZoneOperations(state);
      expect(() => ops.getCards({ zone: "hand" })).toThrow(
        "Owner-scoped zone requires player id: hand",
      );
    });

    it("should throw when scoped player zone does not exist", () => {
      const state = createTestState();
      const ops = createZoneOperations(state);
      expect(() => ops.getCards({ zone: "deck", playerId: "does-not-exist" })).toThrow(
        "Unknown zone",
      );
    });

    it("should return owner-scoped cards for player-scoped query", () => {
      const state = createTestState();
      const cards = createZoneOperations(state).getCards({ zone: "hand", playerId: "p1" });
      expect(cards.every((card) => state.ctx.zones.private.cardIndex[card]?.ownerID === "p1")).toBe(
        true,
      );
    });
  });

  describe("expireReveals", () => {
    it("should remove expired reveals", () => {
      const state = createTestState();
      state.ctx._stateID = 5;
      state.ctx.zones.reveals.active = [
        { revealID: "r1", cardIDs: ["c1"], visibleTo: "all" },
        { revealID: "r2", cardIDs: ["c2"], visibleTo: "all", expiresAtStateID: 10 },
        { revealID: "r3", cardIDs: ["c3"], visibleTo: "all", expiresAtStateID: 3 },
      ];

      const newState = expireReveals(state);

      expect(newState.ctx.zones.reveals.active).toHaveLength(2);
      expect(newState.ctx.zones.reveals.active.map((r) => r.revealID)).toContain("r1");
      expect(newState.ctx.zones.reveals.active.map((r) => r.revealID)).toContain("r2");
      expect(newState.ctx.zones.reveals.active.map((r) => r.revealID)).not.toContain("r3");
    });
  });

  describe("clearRevealsByZone", () => {
    it("should clear reveals whose cards are in the target zone and leave others untouched", () => {
      const state = createTestState();

      const result = create(state, (draft) => {
        const ops = createZoneOperations(draft);
        // Move card-1 to p1's hand; card-2 stays in deck
        ops.moveCard("card-1", { zone: "hand", playerId: "p1" });
        // Set up two reveals: one for the hand card, one for a deck card
        draft.ctx.zones.reveals.active = [
          { revealID: "hand-reveal", cardIDs: ["card-1"], visibleTo: "all" },
          { revealID: "deck-reveal", cardIDs: ["card-2"], visibleTo: "all" },
        ];
        ops.clearRevealsByZone({ zone: "hand", playerId: "p1" });
      });

      const revealIds = result.ctx.zones.reveals.active.map((r) => r.revealID);
      expect(revealIds).not.toContain("hand-reveal");
      expect(revealIds).toContain("deck-reveal");
    });
  });

  describe("performMulligan", () => {
    it("should mulligan hand and draw new cards", () => {
      const state = createTestState();

      // Move some cards to p1's hand
      for (let i = 1; i <= 7; i++) {
        state.ctx.zones.private.zoneCards.hand.push(`card-${i}`);
        state.ctx.zones.private.cardIndex[`card-${i}`].zoneKey = "hand";
      }
      state.ctx.zones.private.zoneCards.deck = state.ctx.zones.private.zoneCards.deck.slice(7);
      state.ctx.zones.public.zoneSummaries.hand.count = 7;
      state.ctx.zones.public.zoneSummaries.deck.count = 33;

      let mulliganResult: MulliganResult | undefined;
      const newState = create(state, (draft) => {
        mulliganResult = performMulligan(draft, "p1", "hand", "deck", 7, 1);
        expect(mulliganResult.success).toBe(true);
        expect(mulliganResult.mulliganedCards).toHaveLength(7);
        expect(mulliganResult.drawnCards).toHaveLength(7);
        expect(mulliganResult.remainingMulligans).toBe(0);
      });

      expect(newState.ctx.zones.public.zoneSummaries.hand.count).toBe(7);
    });

    it("should fail if no mulligans remaining", () => {
      const state = createTestState();

      let mulliganResult: MulliganResult | undefined;
      create(state, (draft) => {
        mulliganResult = performMulligan(draft, "p1", "hand", "deck", 7, 0);
      });

      expect(mulliganResult!.success).toBe(false);
    });
  });
});
