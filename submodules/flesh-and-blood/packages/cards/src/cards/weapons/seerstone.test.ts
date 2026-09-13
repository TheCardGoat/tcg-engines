import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kano } from "../heroes/kano.ts";
import { browbeatBlue } from "../actions/browbeat.ts";
import { seerstone } from "./seerstone.ts";

/**
 * Seerstone (DYN193) — Wizard Weapon - Orb (2H).
 *
 * Printed:
 *   Action - {r}{r}{r}: Look at the top card of your deck. You may put it on
 *   the bottom. Create a Ponder token.
 */

describe("Seerstone (DYN193) AAA", () => {
  it("happy: accepting sinks the looked card to the bottom and creates a Ponder", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        weapon1: [seerstone],
        deckTop: [browbeatBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);

    Kano.activate(seerstone);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    expectFabPlayer(Kano).toHaveTokenCount("ponder", 1);
    // Array decks are bottom-first: the looked card moved from top to bottom.
    expect(Kano.zone("deck")[0]).toContain(browbeatBlue.canonicalId);
  });

  it("boundary: declining keeps the deck order but still creates a Ponder", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        weapon1: [seerstone],
        deckTop: [browbeatBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);

    Kano.activate(seerstone);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expectFabPlayer(Kano).toHaveTokenCount("ponder", 1);
    const deck = Kano.zone("deck");
    expect(deck[deck.length - 1]).toContain(browbeatBlue.canonicalId);
  });

  it("legality: without {r}{r}{r} the activation is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        weapon1: [seerstone],
        resourcePoints: 0,
        actionPoints: 1,
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(kano).expectActivationRejected(seerstone);
    expectFabPlayer(game.as(kano)).toHaveTokenCount("ponder", 0);
  });
});
