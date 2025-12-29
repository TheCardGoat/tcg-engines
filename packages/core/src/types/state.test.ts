import { describe, expect, it } from "bun:test";
import type { CardZoneConfig } from "../zones";
import type { CardId, PlayerId, ZoneId } from "./index";
import type { InternalState, IState } from "./state";

describe("InternalState", () => {
  it("should allow defining zones with configuration and card lists", () => {
    // Test that InternalState can hold zone data
    type TestCardDef = { id: string; name: string };
    type TestCardMeta = { damage?: number };

    const zoneConfig: CardZoneConfig = {
      id: "hand" as unknown as ZoneId,
      name: "Hand",
      visibility: "private",
      ordered: false,
    };

    const internalState: InternalState<TestCardDef, TestCardMeta> = {
      zones: {
        hand: {
          config: zoneConfig,
          cardIds: ["card-1", "card-2"] as unknown as CardId[],
        },
      },
      cards: {},
      cardMetas: {},
    };

    expect(internalState.zones.hand.cardIds).toHaveLength(2);
    expect(internalState.zones.hand.config.visibility).toBe("private");
  });

  it("should allow defining card instances with owner and zone", () => {
    type TestCardDef = { id: string; name: string };
    type TestCardMeta = { damage?: number };

    const internalState: InternalState<TestCardDef, TestCardMeta> = {
      zones: {},
      cards: {
        "card-1": {
          definitionId: "pikachu",
          owner: "player-1" as unknown as PlayerId,
          controller: "player-1" as unknown as PlayerId,
          zone: "hand" as unknown as ZoneId,
        },
      },
      cardMetas: {},
    };

    expect(internalState.cards["card-1"].definitionId).toBe("pikachu");
    expect(internalState.cards["card-1"].owner).toBe(
      "player-1" as unknown as PlayerId,
    );
    expect(internalState.cards["card-1"].zone).toBe(
      "hand" as unknown as ZoneId,
    );
  });

  it("should allow defining card metadata for dynamic properties", () => {
    type TestCardDef = { id: string };
    type TestCardMeta = {
      damage?: number;
      exerted?: boolean;
      effects?: string[];
    };

    const internalState: InternalState<TestCardDef, TestCardMeta> = {
      zones: {},
      cards: {},
      cardMetas: {
        "card-1": {
          damage: 5,
          exerted: true,
          effects: ["poisoned"],
        },
      },
    };

    expect(internalState.cardMetas["card-1"].damage).toBe(5);
    expect(internalState.cardMetas["card-1"].exerted).toBe(true);
  });

  it("should allow position tracking for ordered zones", () => {
    type TestCardDef = { id: string };
    type TestCardMeta = Record<string, never>;

    const internalState: InternalState<TestCardDef, TestCardMeta> = {
      zones: {},
      cards: {
        "card-1": {
          definitionId: "card-def-1",
          owner: "player-1" as unknown as PlayerId,
          controller: "player-1" as unknown as PlayerId,
          zone: "deck" as unknown as ZoneId,
          position: 0, // Top of deck
        },
        "card-2": {
          definitionId: "card-def-2",
          owner: "player-1" as unknown as PlayerId,
          controller: "player-1" as unknown as PlayerId,
          zone: "deck" as unknown as ZoneId,
          position: 1,
        },
      },
      cardMetas: {},
    };

    expect(internalState.cards["card-1"].position).toBe(0);
    expect(internalState.cards["card-2"].position).toBe(1);
  });
});

describe("IState", () => {
  it("should wrap external game state with internal framework state", () => {
    type GameState = {
      turnCount: number;
      currentPlayer: string;
    };

    type TestCardDef = { id: string };
    type TestCardMeta = { damage?: number };

    const state: IState<GameState, TestCardDef, TestCardMeta> = {
      internal: {
        zones: {},
        cards: {},
        cardMetas: {},
      },
      external: {
        turnCount: 1,
        currentPlayer: "player-1",
      },
    };

    // Games can access their state
    expect(state.external.turnCount).toBe(1);
    expect(state.external.currentPlayer).toBe("player-1");

    // Framework manages internal state
    expect(state.internal.zones).toEqual({});
    expect(state.internal.cards).toEqual({});
  });

  it("should allow complex external state while framework manages infrastructure", () => {
    type GameState = {
      players: Array<{ id: string; score: number }>;
      effects: Array<{ type: string; duration: number }>;
    };

    type TestCardDef = { id: string; name: string };
    type TestCardMeta = { counters?: number };

    const state: IState<GameState, TestCardDef, TestCardMeta> = {
      internal: {
        zones: {
          hand: {
            config: {
              id: "hand" as unknown as ZoneId,
              name: "Hand",
              visibility: "private",
              ordered: false,
            },
            cardIds: ["card-1"] as unknown as CardId[],
          },
        },
        cards: {
          "card-1": {
            definitionId: "monster-1",
            owner: "player-1" as unknown as PlayerId,
            controller: "player-1" as unknown as PlayerId,
            zone: "hand" as unknown as ZoneId,
          },
        },
        cardMetas: {
          "card-1": {
            counters: 3,
          },
        },
      },
      external: {
        players: [
          { id: "player-1", score: 100 },
          { id: "player-2", score: 85 },
        ],
        effects: [{ type: "global-buff", duration: 2 }],
      },
    };

    // External game logic
    expect(state.external.players).toHaveLength(2);
    expect(state.external.effects[0].type).toBe("global-buff");

    // Internal framework management
    expect(state.internal.zones.hand.cardIds).toContain("card-1");
    expect(state.internal.cardMetas["card-1"].counters).toBe(3);
  });
});
