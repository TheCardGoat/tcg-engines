import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { azalea } from "../heroes/azalea.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { optekalMonocleBlue } from "./optekal-monocle.ts";

/**
 * Optekal Monocle (ARC037) — Mechanologist Action Item, blue, cost 0.
 *
 * Printed: "Optekal Monocle enters the arena with 5 steam counters on it.
 * When Optekal Monocle has no steam counters on it, destroy it.
 * Action - Remove a steam counter from Optekal Monocle: Opt 1. Go again"
 */

describe("Optekal Monocle (ARC037) AAA", () => {
  it("happy: playing it enters with 5 steam; the Action removes 1 then Opts 1", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [optekalMonocleBlue],
        actionPoints: 2,
        deck: 6,
        deckTop: [snatchRed],
      },
      { hero: azalea, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(optekalMonocleBlue);
    game.untilIdle({ ordering: "listed" });
    expectFabCard(Dash, optekalMonocleBlue).toBeIn("arena");
    expectFabCard(Dash, optekalMonocleBlue).toHaveCounters(5, "steam");

    Dash.activate(optekalMonocleBlue);
    expectFabCard(Dash, optekalMonocleBlue).toHaveCounters(4, "steam");
    game.untilIdle({ ordering: "listed" });
    expectFabPlayer(Dash).toHaveAP(1);
    expect(Dash.zone("deck").at(-1)).toBe(snatchRed.canonicalId);
  });

  it("boundary: a card without the remove-steam Action does not spend a steam counter", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [optekalMonocleBlue, nimblismBlue],
        actionPoints: 2,
        deck: 6,
      },
      { hero: azalea, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(optekalMonocleBlue);
    game.untilIdle({ ordering: "listed" });
    Dash.play(nimblismBlue);
    game.untilIdle({ ordering: "listed" });

    expectFabCard(Dash, optekalMonocleBlue).toHaveCounters(5, "steam");
  });

  it("timing: removing the last steam counter destroys it", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [{ card: optekalMonocleBlue, state: { steamCounters: 1 } }],
        actionPoints: 1,
        deck: 6,
        deckTop: [snatchRed],
      },
      { hero: azalea, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.activate(optekalMonocleBlue);
    game.untilIdle({ ordering: "listed" });
    expectFabCard(Dash, optekalMonocleBlue).toBeIn("graveyard");
  });
});
