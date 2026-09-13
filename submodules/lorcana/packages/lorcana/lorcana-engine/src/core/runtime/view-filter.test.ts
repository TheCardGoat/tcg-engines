import { describe, expect, it } from "bun:test";
import type { LorcanaG } from "../../types/runtime-state";
import { createPlayerId } from "../types";
import type { MatchState, ZoneRuntimeDef } from "./types";
import { createInitialTCGCtx } from "./types";
import { filterMatchView, verifyNoSecretLeakage } from "./view-filter";
import { buildZoneRegistry } from "./zone-registry";

const PLAYER_ONE = createPlayerId("p1");
const PLAYER_TWO = createPlayerId("p2");

const zoneDefinitions: Record<string, ZoneRuntimeDef> = {
  deck: {
    id: "deck",
    name: "Deck",
    visibility: "secret",
    ordered: true,
    ownerScoped: true,
    faceDown: true,
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
    name: "Play",
    visibility: "public",
    ordered: false,
    ownerScoped: true,
  },
  inkwell: {
    id: "inkwell",
    name: "Inkwell",
    visibility: "public",
    ordered: false,
    ownerScoped: true,
    faceDown: true,
  },
};

function createState(): MatchState {
  const ctx = createInitialTCGCtx({
    matchID: "match-1",
    gameID: "game-1",
    rulesetHash: "rules-1",
    players: [{ id: PLAYER_ONE }, { id: PLAYER_TWO }],
  });

  ctx.zones.public.zoneSummaries = {
    "deck:p1": { count: 2, revision: 1 },
    "deck:p2": { count: 2, revision: 1 },
    "hand:p1": { count: 1, revision: 1 },
    "hand:p2": { count: 1, revision: 1 },
    "play:p1": { count: 1, revision: 1 },
    "play:p2": { count: 0, revision: 1 },
    "inkwell:p1": { count: 2, revision: 1 },
    "inkwell:p2": { count: 1, revision: 1 },
  };
  ctx.zones.private.zoneCards = {
    "deck:p1": ["p1-deck-bottom", "p1-deck-top"],
    "deck:p2": ["p2-deck-bottom", "p2-deck-top"],
    "hand:p1": ["p1-hand"],
    "hand:p2": ["p2-hand"],
    "play:p1": ["p1-play"],
    "play:p2": [],
    "inkwell:p1": ["p1-ink-ready", "p1-ink-exerted"],
    "inkwell:p2": ["p2-ink"],
  };

  for (const [zoneKey, cardIds] of Object.entries(ctx.zones.private.zoneCards)) {
    const ownerID = zoneKey.endsWith(":p2") ? PLAYER_TWO : PLAYER_ONE;
    for (let index = 0; index < cardIds.length; index++) {
      const cardId = cardIds[index];
      ctx.zones.private.cardIndex[cardId] = {
        zoneKey,
        ownerID,
        controllerID: ownerID,
        index,
      };
    }
  }
  ctx.zones.private.cardMeta["p1-deck-top"] = { hiddenSentinel: "deck-order" };
  ctx.zones.private.cardMeta["p1-ink-ready"] = { state: "ready", hiddenSentinel: "ink-card" };
  ctx.zones.private.cardMeta["p1-ink-exerted"] = {
    state: "exerted",
    hiddenSentinel: "ink-card",
  };

  return { G: {} as LorcanaG, ctx };
}

describe("filterMatchView", () => {
  it("keeps a public card map safe by removing secret card ids and deck indexes", () => {
    const state = createState();
    const zoneRegistry = buildZoneRegistry(zoneDefinitions, state.ctx.playerIds);
    const view = filterMatchView(state, { role: "player", playerID: PLAYER_ONE }, zoneRegistry);
    const privateZones = view.ctx.zones.private;

    expect(privateZones?.zoneCards["deck:p1"]).toEqual([]);
    expect(privateZones?.zoneCards["deck:p2"]).toBeUndefined();
    expect(privateZones?.cardIndex["p1-deck-top"]).toBeUndefined();
    expect(privateZones?.cardIndex["p1-deck-bottom"]).toBeUndefined();
    expect(privateZones?.cardMeta["p1-deck-top"]).toBeUndefined();
    expect(privateZones?.zoneCards["hand:p1"]).toEqual(["p1-hand"]);
    expect(privateZones?.zoneCards["hand:p2"]).toBeUndefined();
    expect(privateZones?.zoneCards["play:p1"]).toEqual(["p1-play"]);
    expect(
      verifyNoSecretLeakage(state, view, { role: "player", playerID: PLAYER_ONE }, zoneRegistry),
    ).toEqual({ valid: true });
  });

  it("uses opaque ids and public state for face-down cards in public zones", () => {
    const state = createState();
    const zoneRegistry = buildZoneRegistry(zoneDefinitions, state.ctx.playerIds);
    const view = filterMatchView(state, { role: "spectator" }, zoneRegistry);
    const privateZones = view.ctx.zones.private;

    expect(privateZones?.zoneCards["inkwell:p1"]).toEqual([
      "hidden:inkwell:p1:0",
      "hidden:inkwell:p1:1",
    ]);
    expect(privateZones?.cardIndex["p1-ink-ready"]).toBeUndefined();
    expect(privateZones?.cardMeta["p1-ink-ready"]).toBeUndefined();
    expect(privateZones?.cardMeta["hidden:inkwell:p1:0"]).toEqual({ state: "ready" });
    expect(privateZones?.cardMeta["hidden:inkwell:p1:1"]).toEqual({ state: "exerted" });
    expect(privateZones?.zoneCards["play:p1"]).toEqual(["p1-play"]);
    expect(privateZones?.zoneCards["hand:p1"]).toBeUndefined();
  });

  it("restores the real id only while a face-down card is explicitly revealed", () => {
    const state = createState();
    state.ctx.zones.reveals.active = [
      {
        revealID: "reveal-1",
        cardIDs: ["p1-ink-ready"],
        visibleTo: [PLAYER_TWO],
      },
    ];
    const zoneRegistry = buildZoneRegistry(zoneDefinitions, state.ctx.playerIds);
    const playerOne = filterMatchView(
      state,
      { role: "player", playerID: PLAYER_ONE },
      zoneRegistry,
    );
    const playerTwo = filterMatchView(
      state,
      { role: "player", playerID: PLAYER_TWO },
      zoneRegistry,
    );

    expect(playerOne.ctx.zones.private?.zoneCards["inkwell:p1"]?.[0]).toBe("hidden:inkwell:p1:0");
    expect(playerTwo.ctx.zones.private?.zoneCards["inkwell:p1"]?.[0]).toBe("p1-ink-ready");
    expect(playerTwo.ctx.zones.private?.cardIndex["p1-ink-ready"]).toBeDefined();
  });
});
