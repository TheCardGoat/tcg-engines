import { describe, expect, it } from "bun:test";
import { createPlayerId } from "../types";
import { createCardQueryAPI } from "./card-runtime";
import { createCardRuntimeAPI } from "./match-runtime.framework-api";
import { createRecordCardCatalog, createRecordCardInstanceRegistry } from "./static-resources";
import {
  createStateScopedValueCache,
  getOrBuildStateScopedValue,
  getStateScopedValueCacheStats,
} from "./state-scoped-value-cache";
import { createInitialTCGCtx } from "./types";
import type { MatchState } from "./types";
import type { ZoneConfig } from "./match-runtime.types";
import type { BaseCardDefinition } from "./card-contracts";

// Minimal zone definitions for testing (avoids dependency on @tcg/lorcana-engine)
const testZones: Record<string, ZoneConfig> = {
  deck: { id: "deck", name: "Deck", visibility: "secret", ordered: true, ownerScoped: true },
  hand: { id: "hand", name: "Hand", visibility: "private", ordered: false, ownerScoped: true },
  play: { id: "play", name: "Play", visibility: "public", ordered: false, ownerScoped: true },
};

type TestDef = { id: string; canonicalId: string; name: string; cardType: string };

describe("card-runtime", () => {
  it("resolves runtime card view from static resources + ctx.zones", () => {
    const ctx = createInitialTCGCtx({
      matchID: "match-1",
      gameID: "lorcana",
      rulesetHash: "ruleset-1",
    });
    ctx.zones.public.zoneSummaries.deck = { revision: 0, count: 1 };
    ctx.zones.private.zoneCards.deck = ["c000001"];
    ctx.zones.private.cardIndex.c000001 = {
      zoneKey: "deck",
      index: 0,
      ownerID: createPlayerId("p1"),
      controllerID: createPlayerId("p1"),
    };
    ctx.zones.private.cardMeta.c000001 = { damage: 2, state: "ready" };

    const state = {
      G: { ok: true },
      ctx,
    } as unknown as MatchState;

    const cards = createCardQueryAPI(
      state,
      {
        zoneDefinitions: testZones,
        cards: createRecordCardCatalog("cards:test", {
          alpha: {
            id: "alpha",
            canonicalId: "alpha",
            name: "Alpha Unit",
            cardType: "unit",
          } as unknown as BaseCardDefinition,
        }),
        instances: createRecordCardInstanceRegistry("instances:test", {
          c000001: {
            instanceId: "c000001",
            definitionId: "alpha",
            ownerID: "p1",
          },
        }),
      },
      {
        deriveRuntimeCard: ({ card }) => ({
          isOwnedByP1: () => card.ownerID === "p1",
          getZoneOrUnknown: () => card.zoneID ?? "unknown",
        }),
      },
    );

    const card = cards.require("c000001");
    expect(card.instanceId).toBe("c000001");
    expect(card.definitionId).toBe("alpha");
    expect(card.definition.name).toBe("Alpha Unit");
    expect(card.ownerID).toBe("p1");
    expect(card.controllerID).toBe("p1");
    expect(card.zoneID).toBe("deck");
    expect(card.meta.damage).toBe(2);
    expect((card as unknown as { isOwnedByP1: () => boolean }).isOwnedByP1()).toBe(true);
    expect((card as unknown as { getZoneOrUnknown: () => string }).getZoneOrUnknown()).toBe("deck");
  });

  it("queryRuntime filters by owner and zones while preserving candidate order", () => {
    const ctx = createInitialTCGCtx({
      matchID: "match-2",
      gameID: "lorcana",
      rulesetHash: "ruleset-2",
    });

    ctx.zones.private.zoneCards["hand:p1"] = ["c1", "c2"];
    ctx.zones.private.zoneCards["hand:p2"] = ["c3"];
    ctx.zones.private.zoneCards["play:p1"] = ["c4"];

    ctx.zones.private.cardIndex.c1 = {
      zoneKey: "hand:p1",
      index: 0,
      ownerID: createPlayerId("p1"),
      controllerID: createPlayerId("p1"),
    };
    ctx.zones.private.cardIndex.c2 = {
      zoneKey: "hand:p1",
      index: 1,
      ownerID: createPlayerId("p1"),
      controllerID: createPlayerId("p1"),
    };
    ctx.zones.private.cardIndex.c3 = {
      zoneKey: "hand:p2",
      index: 0,
      ownerID: createPlayerId("p2"),
      controllerID: createPlayerId("p2"),
    };
    ctx.zones.private.cardIndex.c4 = {
      zoneKey: "play:p1",
      index: 0,
      ownerID: createPlayerId("p1"),
      controllerID: createPlayerId("p1"),
    };

    const state = {
      G: { ok: true },
      ctx,
    } as unknown as MatchState;

    const staticResources = {
      zoneDefinitions: testZones,
      cards: createRecordCardCatalog("cards:test", {
        alpha: {
          id: "alpha",
          canonicalId: "alpha",
          name: "Alpha",
          cardType: "unit",
        } as unknown as BaseCardDefinition,
        beta: {
          id: "beta",
          canonicalId: "beta",
          name: "Beta",
          cardType: "unit",
        } as unknown as BaseCardDefinition,
        gamma: {
          id: "gamma",
          canonicalId: "gamma",
          name: "Gamma",
          cardType: "unit",
        } as unknown as BaseCardDefinition,
        delta: {
          id: "delta",
          canonicalId: "delta",
          name: "Delta",
          cardType: "unit",
        } as unknown as BaseCardDefinition,
      }),
      instances: createRecordCardInstanceRegistry("instances:test", {
        c1: { instanceId: "c1", definitionId: "alpha", ownerID: "p1" },
        c2: { instanceId: "c2", definitionId: "beta", ownerID: "p1" },
        c3: { instanceId: "c3", definitionId: "gamma", ownerID: "p2" },
        c4: { instanceId: "c4", definitionId: "delta", ownerID: "p1" },
      }),
    };

    const cards = createCardQueryAPI(state, staticResources, {
      actorPlayerId: "p1",
      deriveRuntimeCard: ({ card, actorPlayerId }) => ({
        isOwnedByActor: () => card.ownerID === actorPlayerId,
      }),
    });

    const ownHandCards = cards.queryRuntime({
      selector: "chosen",
      count: 1,
      owner: "you",
      zones: ["hand"],
    });
    expect(ownHandCards.map((card) => card.instanceId)).toEqual(["c1", "c2"]);

    const opponentHandCards = cards.queryRuntime({
      owner: "opponent",
      zones: ["hand"],
    });
    expect(opponentHandCards.map((card) => card.instanceId)).toEqual(["c3"]);

    const playCards = cards.queryRuntime({
      zones: ["play"],
    });
    expect(playCards.map((card) => card.instanceId)).toEqual(["c4"]);

    const projected = cards.queryRuntime(
      { owner: "you", zones: ["hand", "hand:p1"] },
      (card) =>
        `${card.instanceId}:${card.definitionId}:${(card as unknown as { isOwnedByActor: () => boolean }).isOwnedByActor()}`,
    );
    expect(projected).toEqual(["c1:alpha:true", "c2:beta:true"]);
  });

  it("reuses the same runtime card object within one query context", () => {
    const ctx = createInitialTCGCtx({
      matchID: "match-3",
      gameID: "lorcana",
      rulesetHash: "ruleset-3",
    });

    ctx.zones.private.zoneCards["play:p1"] = ["c1"];
    ctx.zones.private.cardIndex.c1 = {
      zoneKey: "play:p1",
      index: 0,
      ownerID: createPlayerId("p1"),
      controllerID: createPlayerId("p1"),
    };

    const state = {
      G: { ok: true },
      ctx,
    } as unknown as MatchState;

    const cards = createCardQueryAPI(
      state,
      {
        zoneDefinitions: testZones,
        cards: createRecordCardCatalog("cards:test", {
          alpha: {
            id: "alpha",
            canonicalId: "alpha",
            name: "Alpha Unit",
            cardType: "unit",
          } as unknown as BaseCardDefinition,
        }),
        instances: createRecordCardInstanceRegistry("instances:test", {
          c1: {
            instanceId: "c1",
            definitionId: "alpha",
            ownerID: "p1",
          },
        }),
      },
      {
        actorPlayerId: "p1",
        deriveRuntimeCard: ({ card }) => ({
          ownerSnapshot: card.ownerID,
        }),
      },
    );

    const fromGet = cards.get("c1");
    const fromRequire = cards.require("c1");
    const fromZone = cards.inZone("play:p1")[0];
    const fromQuery = cards.queryRuntime({ zones: ["play"] })[0];

    expect(fromGet).toBeDefined();
    expect(fromGet).toBe(fromRequire);
    expect(fromRequire).toBe(fromZone);
    expect(fromZone).toBe(fromQuery);
  });

  it("reuses derived payloads across query contexts for the same state+actor and resets on actor/state changes", () => {
    const ctx = createInitialTCGCtx({
      matchID: "match-4",
      gameID: "lorcana",
      rulesetHash: "ruleset-4",
    });

    ctx._stateID = 7;
    ctx.zones.private.zoneCards["play:p1"] = ["c1"];
    ctx.zones.private.cardIndex.c1 = {
      zoneKey: "play:p1",
      index: 0,
      ownerID: createPlayerId("p1"),
      controllerID: createPlayerId("p1"),
    };

    const state = {
      G: { ok: true },
      ctx,
    } as unknown as MatchState;

    const staticResources = {
      zoneDefinitions: testZones,
      cards: createRecordCardCatalog("cards:test", {
        alpha: {
          id: "alpha",
          canonicalId: "alpha",
          name: "Alpha Unit",
          cardType: "unit",
        } as unknown as BaseCardDefinition,
      }),
      instances: createRecordCardInstanceRegistry("instances:test", {
        c1: {
          instanceId: "c1",
          definitionId: "alpha",
          ownerID: "p1",
        },
      }),
    };

    let deriveCalls = 0;
    const runtimeCardCache = createStateScopedValueCache<unknown>();
    const makeCards = (actorPlayerId?: string, sourceState: MatchState = state) =>
      createCardQueryAPI(sourceState, staticResources, {
        actorPlayerId,
        runtimeCardCache,
        deriveRuntimeCard: ({ actorPlayerId: actorId, runtimeCardCache: sharedCache, cardId }) => {
          const cached = getOrBuildStateScopedValue({
            cache: sharedCache!,
            stateID: sourceState.ctx._stateID,
            actorKey: actorId,
            cardId,
            build: () => {
              deriveCalls += 1;
              return { seenBy: actorId ?? "system" };
            },
          });
          return cached as { seenBy: string };
        },
      });

    makeCards("p1").require("c1");
    expect(deriveCalls).toBe(1);
    expect(getStateScopedValueCacheStats(runtimeCardCache)).toMatchObject({
      stateID: 7,
      hits: 0,
      misses: 1,
    });

    makeCards("p1").require("c1");
    expect(deriveCalls).toBe(1);
    expect(getStateScopedValueCacheStats(runtimeCardCache)).toMatchObject({
      stateID: 7,
      hits: 1,
      misses: 1,
    });

    makeCards("p2").require("c1");
    expect(deriveCalls).toBe(2);
    expect(getStateScopedValueCacheStats(runtimeCardCache)).toMatchObject({
      stateID: 7,
      hits: 1,
      misses: 2,
    });

    const nextState = {
      ...state,
      ctx: {
        ...state.ctx,
        _stateID: 8,
      },
    } as MatchState;
    makeCards("p1", nextState).require("c1");
    expect(deriveCalls).toBe(3);
    expect(getStateScopedValueCacheStats(runtimeCardCache)).toMatchObject({
      stateID: 8,
      hits: 0,
      misses: 1,
    });
  });

  it("does not reuse stale runtime card views in write contexts", () => {
    const ctx = createInitialTCGCtx({
      matchID: "match-5",
      gameID: "lorcana",
      rulesetHash: "ruleset-5",
    });

    ctx.zones.private.zoneCards["play:p1"] = ["c1"];
    ctx.zones.private.cardIndex.c1 = {
      zoneKey: "play:p1",
      index: 0,
      ownerID: createPlayerId("p1"),
      controllerID: createPlayerId("p1"),
    };
    ctx.zones.private.cardMeta.c1 = { damage: 1 };

    const state = {
      G: { ok: true },
      ctx,
    } as unknown as MatchState;

    const cardsApi = createCardQueryAPI(
      state,
      {
        zoneDefinitions: testZones,
        cards: createRecordCardCatalog("cards:test", {
          alpha: {
            id: "alpha",
            canonicalId: "alpha",
            name: "Alpha Unit",
            cardType: "unit",
          } as unknown as BaseCardDefinition,
        }),
        instances: createRecordCardInstanceRegistry("instances:test", {
          c1: {
            instanceId: "c1",
            definitionId: "alpha",
            ownerID: "p1",
          },
        }),
      },
      {
        cacheViews: false,
        deriveRuntimeCard: ({ card }) => ({
          damageSnapshot: card.meta.damage ?? 0,
        }),
      },
    );
    const runtimeCards = createCardRuntimeAPI(state as never, cardsApi);

    expect(runtimeCards.require("c1").meta.damage).toBe(1);
    runtimeCards.patchMeta("c1", { damage: 4 });
    expect(runtimeCards.require("c1").meta.damage).toBe(4);
    expect(
      (runtimeCards.require("c1") as unknown as { damageSnapshot: number }).damageSnapshot,
    ).toBe(4);
  });
});
