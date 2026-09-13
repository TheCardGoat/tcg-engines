import { describe, expect, it } from "vitest";
import { fabObjectInstanceId } from "../game/identity.ts";
import { registerFabTestObject } from "../testing/test-fixtures.ts";
import { FabTestEngine } from "../testing/test-engine.ts";
import { attachFabTransformSources, clearFabHostedDescendants } from "./hosted-card-transitions.ts";
import { snapshotObject } from "./snapshots.ts";
import { moveKnownObject } from "./reducers/shared.ts";
import { invalidateFabRulesViews } from "./state-rules-view.ts";
import { invalidateFabRuntimeDerived } from "../runtime-derived.ts";

function state() {
  return FabTestEngine.createStateForRulesTest({
    seed: "hosted-card-transition",
    player1Id: "p1",
    player2Id: "p2",
    cardsMaps: { canonicalIdsByInstance: {}, owners: { p1: [], p2: [] } },
  });
}

function register(match: ReturnType<typeof state>, instanceId: string, canonicalId: string) {
  registerFabTestObject(match, instanceId, canonicalId, "p1");
  match.cardDefinitions[canonicalId] = {
    canonicalId,
    slug: canonicalId,
    base: {
      names: [canonicalId],
      activeFaceIds: [`${canonicalId}:face:front`],
      color: null,
      typeBoxes: [{ metatypes: [], supertypes: [], types: ["Action"], subtypes: [] }],
      typeBox: { metatypes: [], supertypes: [], types: ["Action"], subtypes: [] },
      traits: [],
      textBoxIds: [canonicalId],
      numeric: {},
      keywords: [],
      abilities: [],
    },
    layout: { kind: "single" },
  };
}

describe("hosted-card transitions", () => {
  it("keeps soul zone membership and its canonical host topology in one move", () => {
    const match = state();
    register(match, "light-card", "light-definition");
    match.containers.zonesByPlayerId.p1!.hand = ["light-card"];
    const before = snapshotObject(match, "light-card", "p1", "hand");

    expect(
      moveKnownObject(
        match,
        before,
        "hand",
        "soul",
        {
          instanceId: "light-card",
          incarnation: match.counters.objectIncarnation + 1,
        },
        undefined,
        "p1",
      ),
    ).toBe(true);
    expect(match.containers.zonesByPlayerId.p1!.soul).toEqual(["light-card"]);
    expect(match.containers.subcardsByHostId["soul:p1"]).toEqual(["light-card"]);

    invalidateFabRulesViews(match);
    invalidateFabRuntimeDerived(match);
    const inSoul = snapshotObject(match, "light-card", "p1", "soul");
    expect(
      moveKnownObject(
        match,
        inSoul,
        "soul",
        "banished",
        {
          instanceId: "light-card",
          incarnation: match.counters.objectIncarnation + 1,
        },
        undefined,
        "p1",
      ),
    ).toBe(true);
    expect(match.containers.zonesByPlayerId.p1!.soul).toEqual([]);
    expect(match.containers.subcardsByHostId["soul:p1"]).toBeUndefined();
  });

  it("atomically hosts a top-card with a new incarnation, LKI, history, and cleared state", () => {
    const match = state();
    register(match, "base", "base-definition");
    register(match, "evo", "evo-definition");
    match.containers.zonesByPlayerId.p1!.arms = ["base"];
    match.containers.zonesByPlayerId.p1!.stack = ["evo"];
    match.objects.base = {
      ...match.objects.base!,
      counters: [{ kind: "named", name: "steam", count: 2 }],
      markers: [{ kind: "tapped" }],
    };
    const oldIncarnation = match.objects.base!.incarnation;

    expect(
      attachFabTransformSources({
        state: match,
        sourceIds: [fabObjectInstanceId("base")],
        destination: { kind: "resolving-card", hostId: fabObjectInstanceId("evo") },
      }),
    ).toBe(true);
    expect(match.containers.zonesByPlayerId.p1!.arms).toEqual([]);
    expect(match.containers.subcardsByHostId).toEqual({ evo: ["base"] });
    expect(match.objects.base).toMatchObject({
      incarnation: match.counters.objectIncarnation,
      counters: [],
      markers: [],
      activeFace: { kind: "single" },
      cardPropertyState: { kind: "whole-card" },
    });
    expect(match.objects.base!.history.moves.at(-1)).toMatchObject({
      from: { playerId: "p1", zone: "arms" },
      to: { playerId: null, zone: "under" },
    });
    expect(Object.values(match.lkiArena)).toHaveLength(1);
    expect(Object.values(match.lkiArena)[0]).toMatchObject({
      ref: { instanceId: "base", incarnation: oldIncarnation },
      counters: [{ kind: "named", name: "steam", count: 2 }],
      markers: [{ kind: "tapped" }],
    });
  });

  it("leaves state byte-identical when a multi-source transform is invalid", () => {
    const match = state();
    register(match, "base", "base-definition");
    register(match, "evo", "evo-definition");
    match.containers.zonesByPlayerId.p1!.arms = ["base"];
    match.containers.zonesByPlayerId.p1!.stack = ["evo"];
    const before = structuredClone(match);
    expect(
      attachFabTransformSources({
        state: match,
        sourceIds: [fabObjectInstanceId("base"), fabObjectInstanceId("missing")],
        destination: { kind: "resolving-card", hostId: fabObjectInstanceId("evo") },
      }),
    ).toBe(false);
    expect(match).toEqual(before);
  });

  it("clears an entire hosted tree atomically when the top-card ceases", () => {
    const match = state();
    for (const [instanceId, canonicalId] of [
      ["evo", "evo-definition"],
      ["prior-evo", "prior-evo-definition"],
      ["base", "base-definition"],
    ] as const)
      register(match, instanceId, canonicalId);
    match.containers.zonesByPlayerId.p1!.arms = ["evo"];
    match.containers.subcardsByHostId = {
      evo: [fabObjectInstanceId("prior-evo")],
      "prior-evo": [fabObjectInstanceId("base")],
    };

    expect(clearFabHostedDescendants(match, fabObjectInstanceId("evo"))).toBe(true);
    expect(match.containers.subcardsByHostId).toEqual({});
    expect(match.containers.zonesByPlayerId.p1!.graveyard).toEqual(["prior-evo", "base"]);
    expect(match.objects["prior-evo"]!.history.moves.at(-1)).toMatchObject({
      from: { playerId: null, zone: "under" },
      to: { playerId: "p1", zone: "graveyard" },
    });
    expect(match.objects.base!.incarnation).toBeGreaterThan(
      match.objects["prior-evo"]!.incarnation,
    );
  });

  it("moves a hosted sub-card out to the graveyard and prunes its host topology (destroy-under-this)", () => {
    const match = state();
    register(match, "base", "base-definition");
    register(match, "evo", "evo-definition");
    match.containers.zonesByPlayerId.p1!.arms = ["evo"];
    match.containers.subcardsByHostId = { evo: [fabObjectInstanceId("base")] };
    invalidateFabRulesViews(match);
    invalidateFabRuntimeDerived(match);
    const before = snapshotObject(match, "base", "p1", "under");

    expect(
      moveKnownObject(match, before, "under", "graveyard", {
        instanceId: "base",
        incarnation: match.counters.objectIncarnation + 1,
      }),
    ).toBe(true);

    expect(match.containers.zonesByPlayerId.p1!.graveyard).toEqual(["base"]);
    // The host entry disappears with its last sub-card (topology invariant).
    expect(match.containers.subcardsByHostId).toEqual({});
    expect(match.objects.base!.history.moves.at(-1)).toMatchObject({
      from: { playerId: null, zone: "under" },
      to: { playerId: "p1", zone: "graveyard" },
    });
  });

  it("hosts a card under an explicit host through a move (put a card under this)", () => {
    const match = state();
    register(match, "driver", "driver-definition");
    register(match, "evo", "evo-definition");
    match.containers.zonesByPlayerId.p1!.banished = ["driver"];
    match.containers.zonesByPlayerId.p1!.arms = ["evo"];
    invalidateFabRulesViews(match);
    invalidateFabRuntimeDerived(match);
    const before = snapshotObject(match, "driver", "p1", "banished");

    expect(
      moveKnownObject(
        match,
        before,
        "banished",
        "under",
        { instanceId: "driver", incarnation: match.counters.objectIncarnation + 1 },
        undefined,
        "p1",
        fabObjectInstanceId("evo"),
      ),
    ).toBe(true);

    expect(match.containers.subcardsByHostId).toEqual({ evo: [fabObjectInstanceId("driver")] });
    expect(match.containers.zonesByPlayerId.p1!.banished).toEqual([]);
    expect(match.objects.driver!.history.moves.at(-1)).toMatchObject({
      from: { playerId: "p1", zone: "banished" },
      to: { playerId: null, zone: "under" },
    });
  });

  it("fails closed when a move into under has no explicit host (CR 3.0.14a)", () => {
    const match = state();
    register(match, "driver", "driver-definition");
    register(match, "evo", "evo-definition");
    match.containers.zonesByPlayerId.p1!.banished = ["driver"];
    match.containers.zonesByPlayerId.p1!.arms = ["evo"];
    invalidateFabRulesViews(match);
    invalidateFabRuntimeDerived(match);
    const before = snapshotObject(match, "driver", "p1", "banished");

    expect(
      moveKnownObject(
        match,
        before,
        "banished",
        "under",
        { instanceId: "driver", incarnation: match.counters.objectIncarnation + 1 },
        undefined,
        "p1",
        null,
      ),
    ).toBe(false);
    expect(match.containers.subcardsByHostId).toEqual({});
    expect(match.containers.zonesByPlayerId.p1!.banished).toEqual(["driver"]);
  });
});
