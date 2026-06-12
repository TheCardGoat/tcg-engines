import { describe, expect, it } from "vitest";
import type { ZoneConfig, ZoneRuntimeState } from "../types/index.ts";
import {
  addCardToZone,
  assertZoneConfigured,
  ensureSummary,
  getZoneVisibility,
  makeZoneKey,
  parseZoneKey,
  removeCardFromCurrentZone,
  stripZoneStateForViewer,
  syncSummary,
} from "./zones.ts";

function createTestConfigs(): Record<string, ZoneConfig> {
  return {
    battlefield: {
      id: "battlefield",
      name: "Battlefield",
      visibility: "public",
      ordered: true,
      ownerScoped: true,
    },
    hand: {
      id: "hand",
      name: "Hand",
      visibility: "private",
      ordered: true,
      ownerScoped: true,
    },
    deck: {
      id: "deck",
      name: "Deck",
      visibility: "secret",
      ordered: true,
      ownerScoped: true,
    },
    graveyard: {
      id: "graveyard",
      name: "Graveyard",
      visibility: "public",
      ordered: true,
      ownerScoped: true,
    },
    shared: {
      id: "shared",
      name: "Shared Zone",
      visibility: "public",
      ordered: false,
      ownerScoped: false,
    },
  };
}

function createEmptyState(): ZoneRuntimeState {
  return {
    public: {
      zoneSummaries: {},
    },
    private: {
      zoneCards: {},
      cardIndex: {},
      cardMeta: {},
    },
  };
}

describe("makeZoneKey", () => {
  it("returns just the zone id for a global zone without playerId", () => {
    expect(makeZoneKey({ zone: "shared" })).toBe("shared");
  });

  it("returns 'zone:playerId' for an owner-scoped zone", () => {
    expect(makeZoneKey({ zone: "hand", playerId: "p1" })).toBe("hand:p1");
  });
});

describe("parseZoneKey", () => {
  it("parses a global zone key back to a ZoneRef without playerId", () => {
    expect(parseZoneKey("shared")).toEqual({ zone: "shared" });
  });

  it("parses an owner-scoped zone key back to a ZoneRef with playerId", () => {
    expect(parseZoneKey("hand:p1")).toEqual({ zone: "hand", playerId: "p1" });
  });

  it("is the inverse of makeZoneKey for standard zone ids", () => {
    const ref1 = { zone: "battlefield" as const, playerId: "p1" };
    expect(parseZoneKey(makeZoneKey(ref1))).toEqual(ref1);

    const ref2 = { zone: "shared" as const };
    expect(parseZoneKey(makeZoneKey(ref2))).toEqual(ref2);
  });
});

describe("assertZoneConfigured", () => {
  it("returns the config when the zone exists", () => {
    const configs = createTestConfigs();
    const config = assertZoneConfigured(configs, "hand");
    expect(config).toEqual(configs.hand);
  });

  it("throws an error when the zone does not exist", () => {
    const configs = createTestConfigs();
    expect(() => assertZoneConfigured(configs, "unknown")).toThrow("Unknown zone config: unknown");
  });
});

describe("getZoneVisibility", () => {
  it("returns the visibility from the zone config", () => {
    const configs = createTestConfigs();
    expect(getZoneVisibility(configs, { zone: "battlefield" })).toBe("public");
    expect(getZoneVisibility(configs, { zone: "hand", playerId: "p1" })).toBe("private");
    expect(getZoneVisibility(configs, { zone: "deck", playerId: "p1" })).toBe("secret");
  });

  it("throws when the zone config is missing", () => {
    const configs = createTestConfigs();
    expect(() => getZoneVisibility(configs, { zone: "unknown" })).toThrow(
      "Unknown zone config: unknown",
    );
  });
});

describe("ensureSummary", () => {
  it("creates a summary with revision 0 and count 0 when missing", () => {
    const state = createEmptyState();
    const summary = ensureSummary(state, "hand:p1");
    expect(summary).toEqual({ revision: 0, count: 0 });
    expect(state.public.zoneSummaries["hand:p1"]).toBe(summary);
  });

  it("returns the existing summary without modification", () => {
    const state = createEmptyState();
    state.public.zoneSummaries["hand:p1"] = { revision: 5, count: 3 };
    const summary = ensureSummary(state, "hand:p1");
    expect(summary).toEqual({ revision: 5, count: 3 });
  });
});

describe("syncSummary", () => {
  it("increments revision and sets count to the number of cards", () => {
    const state = createEmptyState();
    state.private.zoneCards["battlefield:p1"] = ["c1", "c2", "c3"];
    const configs = createTestConfigs();

    syncSummary(state, "battlefield:p1", configs);

    const summary = state.public.zoneSummaries["battlefield:p1"];
    expect(summary).toBeDefined();
    expect(summary.revision).toBe(1);
    expect(summary.count).toBe(3);
  });

  it("sets topPublicCardID to the last card for public zones", () => {
    const state = createEmptyState();
    state.private.zoneCards["graveyard:p1"] = ["c1", "c2", "c3"];
    const configs = createTestConfigs();

    syncSummary(state, "graveyard:p1", configs);

    const summary = state.public.zoneSummaries["graveyard:p1"];
    expect(summary.topPublicCardID).toBe("c3");
  });

  it("clears topPublicCardID for secret zones", () => {
    const state = createEmptyState();
    state.private.zoneCards["deck:p1"] = ["c1", "c2"];
    state.public.zoneSummaries["deck:p1"] = { revision: 0, count: 0, topPublicCardID: "c1" };
    const configs = createTestConfigs();

    syncSummary(state, "deck:p1", configs);

    const summary = state.public.zoneSummaries["deck:p1"];
    expect(summary.topPublicCardID).toBeUndefined();
  });

  it("clears topPublicCardID for private zones", () => {
    const state = createEmptyState();
    state.private.zoneCards["hand:p1"] = ["c1", "c2"];
    state.public.zoneSummaries["hand:p1"] = { revision: 0, count: 0, topPublicCardID: "c1" };
    const configs = createTestConfigs();

    syncSummary(state, "hand:p1", configs);

    const summary = state.public.zoneSummaries["hand:p1"];
    expect(summary.topPublicCardID).toBeUndefined();
  });

  it("clears topPublicCardID when the zone is empty", () => {
    const state = createEmptyState();
    state.private.zoneCards["battlefield:p1"] = [];
    state.public.zoneSummaries["battlefield:p1"] = { revision: 2, count: 1, topPublicCardID: "c1" };
    const configs = createTestConfigs();

    syncSummary(state, "battlefield:p1", configs);

    const summary = state.public.zoneSummaries["battlefield:p1"];
    expect(summary.count).toBe(0);
    expect(summary.revision).toBe(3);
    expect(summary.topPublicCardID).toBeUndefined();
  });
});

describe("removeCardFromCurrentZone", () => {
  it("removes the card from its zone and reindexes remaining cards", () => {
    const state = createEmptyState();
    state.private.zoneCards["hand:p1"] = ["c1", "c2", "c3"];
    state.private.cardIndex["c1"] = {
      zoneKey: "hand:p1",
      index: 0,
      ownerId: "p1",
      controllerId: "p1",
    };
    state.private.cardIndex["c2"] = {
      zoneKey: "hand:p1",
      index: 1,
      ownerId: "p1",
      controllerId: "p1",
    };
    state.private.cardIndex["c3"] = {
      zoneKey: "hand:p1",
      index: 2,
      ownerId: "p1",
      controllerId: "p1",
    };

    const oldKey = removeCardFromCurrentZone(state, "c2");

    expect(oldKey).toBe("hand:p1");
    expect(state.private.zoneCards["hand:p1"]).toEqual(["c1", "c3"]);
    expect(state.private.cardIndex["c1"].index).toBe(0);
    expect(state.private.cardIndex["c3"].index).toBe(1);
  });

  it("returns the old zone key", () => {
    const state = createEmptyState();
    state.private.zoneCards["deck:p1"] = ["c1"];
    state.private.cardIndex["c1"] = {
      zoneKey: "deck:p1",
      index: 0,
      ownerId: "p1",
      controllerId: "p1",
    };

    const oldKey = removeCardFromCurrentZone(state, "c1");

    expect(oldKey).toBe("deck:p1");
  });

  it("returns undefined if the card is not indexed", () => {
    const state = createEmptyState();
    expect(removeCardFromCurrentZone(state, "missing")).toBeUndefined();
  });

  it("handles removing the last card without error", () => {
    const state = createEmptyState();
    state.private.zoneCards["hand:p1"] = ["c1"];
    state.private.cardIndex["c1"] = {
      zoneKey: "hand:p1",
      index: 0,
      ownerId: "p1",
      controllerId: "p1",
    };

    removeCardFromCurrentZone(state, "c1");

    expect(state.private.zoneCards["hand:p1"]).toEqual([]);
  });
});

describe("addCardToZone", () => {
  it("appends the card to the end of the zone by default", () => {
    const state = createEmptyState();
    state.private.zoneCards["hand:p1"] = ["c1"];
    state.private.cardIndex["c1"] = {
      zoneKey: "hand:p1",
      index: 0,
      ownerId: "p1",
      controllerId: "p1",
    };
    state.private.cardIndex["c2"] = {
      zoneKey: "deck:p1",
      index: 0,
      ownerId: "p1",
      controllerId: "p1",
    };

    addCardToZone(state, "c2", "hand:p1");

    expect(state.private.zoneCards["hand:p1"]).toEqual(["c1", "c2"]);
    expect(state.private.cardIndex["c2"]).toEqual({
      zoneKey: "hand:p1",
      index: 1,
      ownerId: "p1",
      controllerId: "p1",
    });
  });

  it("inserts the card at a specific index when provided", () => {
    const state = createEmptyState();
    state.private.zoneCards["hand:p1"] = ["c1", "c2", "c3"];
    state.private.cardIndex["c1"] = {
      zoneKey: "hand:p1",
      index: 0,
      ownerId: "p1",
      controllerId: "p1",
    };
    state.private.cardIndex["c2"] = {
      zoneKey: "hand:p1",
      index: 1,
      ownerId: "p1",
      controllerId: "p1",
    };
    state.private.cardIndex["c3"] = {
      zoneKey: "hand:p1",
      index: 2,
      ownerId: "p1",
      controllerId: "p1",
    };
    state.private.cardIndex["c4"] = {
      zoneKey: "deck:p1",
      index: 0,
      ownerId: "p1",
      controllerId: "p1",
    };

    addCardToZone(state, "c4", "hand:p1", 1);

    expect(state.private.zoneCards["hand:p1"]).toEqual(["c1", "c4", "c2", "c3"]);
    expect(state.private.cardIndex["c1"].index).toBe(0);
    expect(state.private.cardIndex["c4"].index).toBe(1);
    expect(state.private.cardIndex["c2"].index).toBe(2);
    expect(state.private.cardIndex["c3"].index).toBe(3);
  });

  it("reindexes cards after insertion", () => {
    const state = createEmptyState();
    state.private.zoneCards["battlefield:p1"] = ["c1", "c2"];
    state.private.cardIndex["c1"] = {
      zoneKey: "battlefield:p1",
      index: 0,
      ownerId: "p1",
      controllerId: "p1",
    };
    state.private.cardIndex["c2"] = {
      zoneKey: "battlefield:p1",
      index: 1,
      ownerId: "p1",
      controllerId: "p1",
    };
    state.private.cardIndex["c3"] = {
      zoneKey: "deck:p1",
      index: 0,
      ownerId: "p1",
      controllerId: "p1",
    };

    addCardToZone(state, "c3", "battlefield:p1", 0);

    expect(state.private.zoneCards["battlefield:p1"]).toEqual(["c3", "c1", "c2"]);
    expect(state.private.cardIndex["c3"].index).toBe(0);
    expect(state.private.cardIndex["c1"].index).toBe(1);
    expect(state.private.cardIndex["c2"].index).toBe(2);
  });

  it("throws if the card is not in the index", () => {
    const state = createEmptyState();
    expect(() => addCardToZone(state, "missing", "hand:p1")).toThrow(
      "Card missing not found in card index",
    );
  });
});

describe("stripZoneStateForViewer", () => {
  it("shows full card lists for public zones", () => {
    const state = createEmptyState();
    state.private.zoneCards["shared"] = ["c1", "c2"];
    state.private.zoneCards["battlefield:p1"] = ["c3", "c4"];
    const configs = createTestConfigs();
    state.public.zoneSummaries["shared"] = { revision: 1, count: 2 };
    state.public.zoneSummaries["battlefield:p1"] = { revision: 1, count: 2 };

    const result = stripZoneStateForViewer(state, "p2", configs);

    expect(result.visibleCards["shared"]).toEqual(["c1", "c2"]);
    expect(result.visibleCards["battlefield:p1"]).toEqual(["c3", "c4"]);
  });

  it("shows full card lists for private zones to the owner", () => {
    const state = createEmptyState();
    state.private.zoneCards["hand:p1"] = ["c1", "c2"];
    const configs = createTestConfigs();
    state.public.zoneSummaries["hand:p1"] = { revision: 1, count: 2 };

    const result = stripZoneStateForViewer(state, "p1", configs);

    expect(result.visibleCards["hand:p1"]).toEqual(["c1", "c2"]);
  });

  it("hides contents of private zones from non-owners", () => {
    const state = createEmptyState();
    state.private.zoneCards["hand:p1"] = ["c1", "c2"];
    const configs = createTestConfigs();
    state.public.zoneSummaries["hand:p1"] = { revision: 1, count: 2 };

    const result = stripZoneStateForViewer(state, "p2", configs);

    expect(result.visibleCards["hand:p1"]).toEqual([]);
  });

  it("hides contents of secret zones from everyone", () => {
    const state = createEmptyState();
    state.private.zoneCards["deck:p1"] = ["c1", "c2"];
    const configs = createTestConfigs();
    state.public.zoneSummaries["deck:p1"] = { revision: 1, count: 2 };

    const resultForOwner = stripZoneStateForViewer(state, "p1", configs);
    const resultForOpponent = stripZoneStateForViewer(state, "p2", configs);

    expect(resultForOwner.visibleCards["deck:p1"]).toEqual([]);
    expect(resultForOpponent.visibleCards["deck:p1"]).toEqual([]);
  });

  it("preserves zone summaries", () => {
    const state = createEmptyState();
    state.private.zoneCards["hand:p1"] = ["c1", "c2"];
    state.public.zoneSummaries["hand:p1"] = { revision: 3, count: 2 };
    const configs = createTestConfigs();

    const result = stripZoneStateForViewer(state, "p2", configs);

    expect(result.zoneSummaries["hand:p1"]).toEqual({ revision: 3, count: 2 });
  });

  it("skips zones with missing configs", () => {
    const state = createEmptyState();
    state.private.zoneCards["unknown:p1"] = ["c1"];
    const configs = createTestConfigs();

    const result = stripZoneStateForViewer(state, "p1", configs);

    expect(result.visibleCards["unknown:p1"]).toBeUndefined();
  });
});
