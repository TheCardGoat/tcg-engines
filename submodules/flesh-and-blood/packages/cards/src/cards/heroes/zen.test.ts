import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { whelmingGustwaveRed } from "../actions/whelming-gustwave.ts";
import { zen } from "./zen.ts";

/**
 * Zen (MST047) — Mystic Ninja Hero — Young.
 *
 * Printed: "Once per Turn Instant - {c}{c}{c}: Create a Crouching Tiger in
 * your hand. Search your deck for a card with combo, banish it, then shuffle.
 * You may play it this turn."
 *
 * Signature weapon: Tiger Taming Khakkara (MST159).
 *
 * Pattern mirrors zen-tamer-of-purpose.test.ts (adult MST046).
 */

const opponentHero = dash;

describe("zen (MST047) AAA", () => {
  it("happy: pay {c}{c}{c} to mint a Crouching Tiger and banish a combo card", () => {
    const game = FabTestEngine.start(
      {
        hero: zen,
        hand: [],
        chiPoints: 3,
        deckTop: [whelmingGustwaveRed],
        actionPoints: 1,
      },
      { hero: opponentHero, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zen = game.as(zen);

    Zen.activate(zen);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: whelmingGustwaveRed.canonicalId });

    expect(Zen.zone("hand")).toContain("token:crouching-tiger");
    expectFabCard(Zen, whelmingGustwaveRed).toBeIn("banished");
  });

  it("boundary: once-per-turn blocks a second Instant with chi remaining", () => {
    const game = FabTestEngine.start(
      {
        hero: zen,
        hand: [],
        chiPoints: 6,
        deckTop: [whelmingGustwaveRed],
        actionPoints: 1,
      },
      { hero: opponentHero, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zen = game.as(zen);

    Zen.activate(zen);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: whelmingGustwaveRed.canonicalId });
    Zen.expectActivationRejected(zen);
  });

  it("boundary: unpayable {c}{c}{c} cost is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: zen,
        hand: [],
        chiPoints: 2,
        deck: 6,
        actionPoints: 1,
      },
      { hero: opponentHero, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(zen).expectActivationRejected(zen);
  });
});
