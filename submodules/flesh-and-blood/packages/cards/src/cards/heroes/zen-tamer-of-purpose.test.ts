import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { whelmingGustwaveRed } from "../actions/whelming-gustwave.ts";
import { zenTamerOfPurpose } from "./zen-tamer-of-purpose.ts";

/**
 * Zen, Tamer of Purpose (MST046) — Mystic Ninja Hero 40hp.
 *
 * Printed: Once per Turn Instant - {c}{c}{c}: Create a Crouching Tiger in
 * your hand. Search your deck for a card with combo, banish it, then shuffle.
 * You may play it this turn.
 */

describe("Zen, Tamer of Purpose (MST046) AAA", () => {
  it("happy: pay {c}{c}{c} to mint a Crouching Tiger and banish a combo card", () => {
    const game = FabTestEngine.start(
      {
        hero: zenTamerOfPurpose,
        hand: [],
        chiPoints: 3,
        deckTop: [whelmingGustwaveRed],
        actionPoints: 1,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zen = game.as(zenTamerOfPurpose);

    Zen.activate(zenTamerOfPurpose);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: whelmingGustwaveRed.canonicalId });

    expect(Zen.zone("hand")).toContain("token:crouching-tiger");
    expectFabCard(Zen, whelmingGustwaveRed).toBeIn("banished");
  });

  it("boundary: once-per-turn blocks a second Instant with chi remaining", () => {
    const game = FabTestEngine.start(
      {
        hero: zenTamerOfPurpose,
        hand: [],
        chiPoints: 6,
        deckTop: [whelmingGustwaveRed],
        actionPoints: 1,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zen = game.as(zenTamerOfPurpose);

    Zen.activate(zenTamerOfPurpose);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: whelmingGustwaveRed.canonicalId });
    Zen.expectActivationRejected(zenTamerOfPurpose);
  });

  it("boundary: unpayable {c}{c}{c} cost is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: zenTamerOfPurpose,
        hand: [],
        chiPoints: 2,
        deck: 6,
        actionPoints: 1,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(zenTamerOfPurpose).expectActivationRejected(zenTamerOfPurpose);
  });
});
