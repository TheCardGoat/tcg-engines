import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nuu } from "./nuu.ts";

/**
 * Nuu (MST002) — Mystic Assassin Hero — Young.
 *
 * Printed Instant: "{c}{c}{c}: Look at the top card of an opposing hero's deck.
 * If it's blue, you may banish it. Until end of turn, you may play blue cards
 * from that hero's banished zone without paying their {r} cost."
 *
 * Look/banish/optional/chi-cost plus playing the banished blue from that
 * hero's banished zone (cross-owner play origin).
 */

describe("Nuu (MST002) AAA", () => {
  it("happy: look at a blue top and banish it", () => {
    const game = FabTestEngine.start(
      { hero: nuu, chiPoints: 3, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deckTop: [nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Nuu = game.as(nuu);
    const Dash = game.as(dash);

    Nuu.activate(nuu);
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    // The whole {c}{c}{c} was paid and the blue top card moved to Nuu's
    // banish (Dash's banished zone).
    expect(Dash.zone("banished")).toContain(nimblismBlue.canonicalId);
    expect(Dash.zone("deck")).not.toContain(nimblismBlue.canonicalId);

    Nuu.play(nimblismBlue, { from: "banished" });
    game.untilIdle({ ordering: "listed" });
    expectFabCard(Nuu, nimblismBlue).toBeIn("graveyard");
  });

  it("boundary: the banish is optional — declining keeps the blue top in the deck", () => {
    const game = FabTestEngine.start(
      { hero: nuu, chiPoints: 3, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deckTop: [nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(nuu).activate(nuu);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expect(Dash.zone("banished")).not.toContain(nimblismBlue.canonicalId);
    expect(Dash.zone("deck")).toContain(nimblismBlue.canonicalId);
  });

  it("boundary: a red top is not banished", () => {
    const game = FabTestEngine.start(
      { hero: nuu, chiPoints: 3, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deckTop: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(nuu).activate(nuu);
    game.untilIdle({ ordering: "listed" });

    expect(Dash.zone("deck")).toContain(snatchRed.canonicalId);
    expect(Dash.zone("banished")).not.toContain(snatchRed.canonicalId);
  });

  it("boundary: unpayable {c}{c}{c} is rejected", () => {
    const game = FabTestEngine.start(
      { hero: nuu, chiPoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(nuu).expectActivationRejected(nuu);
  });

  it("timing: the opposing-banished permission expires at end of turn", () => {
    const game = FabTestEngine.start(
      { hero: nuu, chiPoints: 3, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deckTop: [nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Nuu = game.as(nuu);

    Nuu.activate(nuu);
    game.untilIdle({ optionals: "accept", ordering: "listed" });
    Nuu.endTurn();
    game.as(dash).endTurn();

    expectFabUnplayable(
      () => Nuu.play(nimblismBlue, { from: "banished" }),
      /Playing from banished requires a migrated permission effect|no longer in a legal play zone/,
    );
  });
});
