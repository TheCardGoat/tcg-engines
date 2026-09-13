import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabToken,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { auricShardsRed } from "../instants/auric-shards.ts";
import { zyggy } from "./zyggy.ts";

/**
 * Zyggy (OMN002) — Lightning Illusionist Hero — Young — 20hp.
 *
 * Printed: "Instant - {r}{r}, {t}, destroy a Lightning Flow you control, banish
 * another Lightning aura permanent you control with no holo counters: Return
 * the banished aura to the arena with a holo counter."
 *
 * Pattern mirrors zyggy-starlight.test.ts (adult AZS001) — Auric Shards is the
 * authored Lightning aura used for the banish-and-return leg.
 */

describe("Zyggy (OMN002) AAA", () => {
  it("happy: pay {r}{r}, tap, destroy Lightning Flow, banish Auric Shards, return it with a holo counter", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggy,
        hand: [],
        resourcePoints: 2,
        arena: [fabToken("lightning-flow"), auricShardsRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggy);

    Zyggy.activate(zyggy);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    // The Lightning Flow was destroyed; Auric Shards returned with a holo counter.
    expectFabToken(game, "lightning-flow").toHaveCount(0);
    expectFabCard(Zyggy, auricShardsRed).toBeIn("arena");
    expectFabCard(Zyggy, auricShardsRed).toHaveCounters(1, "holo");
  });

  it("boundary: without {r}{r} the Instant is unpayable", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggy,
        hand: [],
        resourcePoints: 1,
        arena: [fabToken("lightning-flow"), auricShardsRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(zyggy).expectActivationRejected(zyggy);
  });

  it("boundary: without a Lightning Flow to destroy the Instant is unpayable", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggy,
        hand: [],
        resourcePoints: 2,
        arena: [auricShardsRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(zyggy).expectActivationRejected(zyggy);
  });
});
