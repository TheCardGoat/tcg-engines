import { describe, expect, it } from "bun:test";
import type { CardZoneConfig } from "../zones";
import type { CardId, PlayerId, ZoneId } from "./index";
import type { IState, InternalState } from "./state";

describe("InternalState", () => {
  it("should allow defining zones with configuration and card lists", () => {
    // Test that InternalState can hold zone data
    interface TestCardDef {
      id: string;
      name: string;
    }
    interface TestCardMeta {
      damage?: number;
    }

    const zoneConfig: CardZoneConfig = {
      id: "hand" as unknown as ZoneId,
      name: "Hand",
      ordered: false,
      visibility: "private",
    };

    const internalState: InternalState<TestCardDef, TestCardMeta> = {
      cardMetas: {},
      cards: {},
      zones: {
        hand: {
          cardIds: ["card-1", "card-2"] as unknown as CardId[],
          config: zoneConfig,
        },
      },
    };

    expect(internalState.zones.hand.cardIds).toHaveLength(2);
    expect(internalState.zones.hand.config.visibility).toBe("private");
  });

  it("should allow defining card instances with owner and zone", () => {
    interface TestCardDef {
      id: string;
      name: string;
    }
    interface TestCardMeta {
      damage?: number;
    }

    const internalState: InternalState<TestCardDef, TestCardMeta> = {
      cardMetas: {},
      cards: {
        "card-1": {
          controller: "player-1" as unknown as PlayerId,
          definitionId: "pikachu",
          owner: "player-1" as unknown as PlayerId,
          zone: "hand" as unknown as ZoneId,
        },
      },
      zones: {},
    };

    expect(internalState.cards["card-1"].definitionId).toBe("pikachu");
    expect(internalState.cards["card-1"].owner).toBe("player-1" as unknown as PlayerId);
    expect(internalState.cards["card-1"].zone).toBe("hand" as unknown as ZoneId);
  });

  it("should allow defining card metadata for dynamic properties", () => {
    interface TestCardDef {
      id: string;
    }
    interface TestCardMeta {
      damage?: number;
      exerted?: boolean;
      effects?: string[];
    }

    const internalState: InternalState<TestCardDef, TestCardMeta> = {
      cardMetas: {
        "card-1": {
          damage: 5,
          effects: ["poisoned"],
          exerted: true,
        },
      },
      cards: {},
      zones: {},
    };

    expect(internalState.cardMetas["card-1"].damage).toBe(5);
    expect(internalState.cardMetas["card-1"].exerted).toBe(true);
  });

  it("should allow position tracking for ordered zones", () => {
    interface TestCardDef {
      id: string;
    }
    type TestCardMeta = Record<string, never>;

    const internalState: InternalState<TestCardDef, TestCardMeta> = {
      cardMetas: {},
      cards: {
        "card-1": {
          controller: "player-1" as unknown as PlayerId,
          definitionId: "card-def-1",
          owner: "player-1" as unknown as PlayerId,
          position: 0,
          zone: "deck" as unknown as ZoneId, // Top of deck
        },
        "card-2": {
          controller: "player-1" as unknown as PlayerId,
          definitionId: "card-def-2",
          owner: "player-1" as unknown as PlayerId,
          position: 1,
          zone: "deck" as unknown as ZoneId,
        },
      },
      zones: {},
    };

    expect(internalState.cards["card-1"].position).toBe(0);
    expect(internalState.cards["card-2"].position).toBe(1);
  });
});

describe("IState", () => {
  it("should wrap external game state with internal framework state", () => {
    interface GameState {
      turnCount: number;
      currentPlayer: string;
    }

    interface TestCardDef {
      id: string;
    }
    interface TestCardMeta {
      damage?: number;
    }

    const state: IState<GameState, TestCardDef, TestCardMeta> = {
      external: {
        currentPlayer: "player-1",
        turnCount: 1,
      },
      internal: {
        cardMetas: {},
        cards: {},
        zones: {},
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
    interface GameState {
      players: { id: string; score: number }[];
      effects: { type: string; duration: number }[];
    }

    interface TestCardDef {
      id: string;
      name: string;
    }
    interface TestCardMeta {
      counters?: number;
    }

    const state: IState<GameState, TestCardDef, TestCardMeta> = {
      external: {
        effects: [{ duration: 2, type: "global-buff" }],
        players: [
          { id: "player-1", score: 100 },
          { id: "player-2", score: 85 },
        ],
      },
      internal: {
        cardMetas: {
          "card-1": {
            counters: 3,
          },
        },
        cards: {
          "card-1": {
            controller: "player-1" as unknown as PlayerId,
            definitionId: "monster-1",
            owner: "player-1" as unknown as PlayerId,
            zone: "hand" as unknown as ZoneId,
          },
        },
        zones: {
          hand: {
            cardIds: ["card-1"] as unknown as CardId[],
            config: {
              id: "hand" as unknown as ZoneId,
              name: "Hand",
              ordered: false,
              visibility: "private",
            },
          },
        },
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
