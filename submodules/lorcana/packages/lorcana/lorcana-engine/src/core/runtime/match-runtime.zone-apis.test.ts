import { describe, it, expect } from "bun:test";
import { createZoneQueryAPI as createRawZoneQueryAPI } from "./match-runtime.zone-apis";
import { createInitialTCGCtx } from "./types";
import type { MatchState, ZoneRuntimeDef } from "./types";
import type { CardQueryAPI } from "./card-runtime";
import type { BaseCardDefinition } from "./card-contracts";
import { createPlayerId } from "../types";

const testZoneDefs: Record<string, ZoneRuntimeDef> = {
  play: {
    id: "play",
    name: "Play Area",
    visibility: "public",
    ordered: true,
    ownerScoped: false,
  },
  hand: {
    id: "hand",
    name: "Hand",
    visibility: "private",
    ordered: false,
    ownerScoped: true,
  },
};

function createZoneQueryAPI(state: MatchState, cardsApi: CardQueryAPI) {
  return createRawZoneQueryAPI(state, cardsApi, { ...testZoneDefs });
}

function createTestState() {
  const ctx = createInitialTCGCtx({
    matchID: "match-123",
    gameID: "lorcana",
    rulesetHash: "ruleset-v1",
  });

  ctx.zones.public.zoneSummaries = {
    play: { revision: 0, count: 2 },
    hand: { revision: 0, count: 1 },
  };
  ctx.zones.private.zoneCards = {
    play: ["card-1", "card-2"],
    hand: ["card-3"],
  };

  ctx.zones.private.cardIndex["card-1"] = {
    zoneKey: "play",
    ownerID: createPlayerId("p1"),
    controllerID: createPlayerId("p1"),
  };
  ctx.zones.private.cardIndex["card-2"] = {
    zoneKey: "play",
    ownerID: createPlayerId("p2"),
    controllerID: createPlayerId("p1"),
  };
  ctx.zones.private.cardIndex["card-3"] = {
    zoneKey: "hand",
    ownerID: createPlayerId("p1"),
    controllerID: createPlayerId("p1"),
  };

  return { G: { turn: 1 } as any, ctx };
}

const stubCardsApi = {
  get: () => undefined,
  require: () => {
    throw new Error("not found");
  },
  getDefinition: () => undefined,
  getDefinitionById: () => undefined,
  getMeta: () => undefined,
  inZone: () => [],
} as unknown as CardQueryAPI;

describe("createZoneQueryAPI", () => {
  describe("getCardZone", () => {
    it("returns the zone key for a card in play", () => {
      const state = createTestState();
      const api = createZoneQueryAPI(state, stubCardsApi);
      expect(api.getCardZone("card-1")).toBe("play");
    });

    it("returns the zone key for a card in hand", () => {
      const state = createTestState();
      const api = createZoneQueryAPI(state, stubCardsApi);
      expect(api.getCardZone("card-3")).toBe("hand");
    });

    it("returns undefined for unknown card", () => {
      const state = createTestState();
      const api = createZoneQueryAPI(state, stubCardsApi);
      expect(api.getCardZone("nonexistent")).toBeUndefined();
    });
  });

  describe("getCardOwner", () => {
    it("returns the owner for a card", () => {
      const state = createTestState();
      const api = createZoneQueryAPI(state, stubCardsApi);
      expect(api.getCardOwner("card-1")).toBe("p1");
    });

    it("returns the correct owner for a card controlled by another player", () => {
      const state = createTestState();
      const api = createZoneQueryAPI(state, stubCardsApi);
      expect(api.getCardOwner("card-2")).toBe("p2");
    });

    it("returns undefined for unknown card", () => {
      const state = createTestState();
      const api = createZoneQueryAPI(state, stubCardsApi);
      expect(api.getCardOwner("nonexistent")).toBeUndefined();
    });
  });

  describe("getCardController", () => {
    it("returns the controller for a card", () => {
      const state = createTestState();
      const api = createZoneQueryAPI(state, stubCardsApi);
      expect(api.getCardController("card-1")).toBe("p1");
    });

    it("returns different controller than owner when card is controlled by another player", () => {
      const state = createTestState();
      const api = createZoneQueryAPI(state, stubCardsApi);
      expect(api.getCardOwner("card-2")).toBe("p2");
      expect(api.getCardController("card-2")).toBe("p1");
    });

    it("returns undefined for unknown card", () => {
      const state = createTestState();
      const api = createZoneQueryAPI(state, stubCardsApi);
      expect(api.getCardController("nonexistent")).toBeUndefined();
    });
  });
});
