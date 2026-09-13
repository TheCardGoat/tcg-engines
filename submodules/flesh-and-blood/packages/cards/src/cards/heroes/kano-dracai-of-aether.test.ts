import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { kanoDracaiOfAether } from "./kano-dracai-of-aether.ts";
import { snatchRed } from "../actions/snatch.ts";
import { tomeOfFyendalYellow } from "../actions/tome-of-fyendal.ts";

/**
 * Kano, Dracai of Aether (ARC113) — printed:
 * "Instant - {r}{r}{r}: Look at the top card of your deck. If it's a
 * 'non-attack' action card, you may banish it. If you do, you may play it
 * this turn as though it were an instant."
 *
 * Mode B (fab-rules): CR 5.2 activated abilities; glossary Instant — no action
 * point, playable at any layer by the active player; CR 1.13.3 three resource
 * points are paid at activation; the play permission is this-turn only and the
 * exclude-Attack filter gates the banish optional.
 */
describe("Kano, Dracai of Aether (ARC113) AAA", () => {
  it("happy: pay {r}{r}{r}, banish the non-attack action top card, then play it from banish as an instant", () => {
    const game = FabTestEngine.start(
      {
        hero: kanoDracaiOfAether,
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, tomeOfFyendalYellow],
        resourcePoints: 4,
        hand: [],
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Kano = game.as(kanoDracaiOfAether);
    // Adult Kano seats at the printed 30 life.
    expectFabPlayer(Kano).toHaveLife(30);

    Kano.activate(kanoDracaiOfAether);
    game.passBoth();

    // Accept the optional banish, then the optional this-turn play permission.
    Kano.chooseBoolean(true);
    Kano.chooseBoolean(true);

    expect(Kano.zone("banished")).toContain(tomeOfFyendalYellow.canonicalId);
    expect(Kano.resourcePoints()).toBe(1);

    // Play the banished card as though it were an instant, still this turn.
    game.helpers.passPriorityTo(Kano);
    Kano.play(tomeOfFyendalYellow, { from: "banished" });
    game.passBoth();

    // The tome resolved: out of banish, into the graveyard, drew 2.
    expect(Kano.zone("banished")).not.toContain(tomeOfFyendalYellow.canonicalId);
    expect(Kano.zone("graveyard")).toContain(tomeOfFyendalYellow.canonicalId);
    expectFabPlayer(Kano).toHaveHandCount(2);
    expect(Kano.resourcePoints()).toBe(0);
  });

  it("boundary: an attack action on top is never banished, and {r}{r} is not enough to activate", () => {
    const attackOnTop = FabTestEngine.start(
      {
        hero: kanoDracaiOfAether,
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, snatchRed],
        resourcePoints: 3,
        hand: [],
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Kano = attackOnTop.as(kanoDracaiOfAether);

    Kano.activate(kanoDracaiOfAether);
    attackOnTop.passBoth();

    // No banish optional is presented for an Attack action; nothing moves.
    expect(Kano.zone("banished")).not.toContain(snatchRed.canonicalId);
    expect(Kano.zone("deck")).toContain(snatchRed.canonicalId);

    const underfunded = FabTestEngine.start(
      {
        hero: kanoDracaiOfAether,
        deck: [tomeOfFyendalYellow],
        resourcePoints: 2,
        hand: [],
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    underfunded.as(kanoDracaiOfAether).expectActivationRejected(kanoDracaiOfAether);
  });

  it("timing: the play-from-banish permission expires at end of turn", () => {
    const game = FabTestEngine.start(
      {
        hero: kanoDracaiOfAether,
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, tomeOfFyendalYellow],
        resourcePoints: 3,
        hand: [],
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Kano = game.as(kanoDracaiOfAether);

    Kano.activate(kanoDracaiOfAether);
    game.passBoth();
    Kano.chooseBoolean(true);
    Kano.chooseBoolean(true);
    expect(Kano.zone("banished")).toContain(tomeOfFyendalYellow.canonicalId);

    // Do not play it; let the turn cycle.
    game.helpers.passPriorityTo(Kano);
    Kano.endTurn();
    game.as(dash).endTurn();

    expect(() => Kano.play(tomeOfFyendalYellow, { from: "banished" })).toThrow();
  });
});
