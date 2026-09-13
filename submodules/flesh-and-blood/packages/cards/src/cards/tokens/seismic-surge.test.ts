import { describe, expect, it } from "vitest";
import {
  FabTestEngine,
  expectCombat,
  seedResourcePoints,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { chokeslamBlue } from "../actions/chokeslam.ts";
import { brutalAssaultBlue } from "../actions/brutal-assault.ts";
import { seismicSurge } from "./seismic-surge.ts";

/**
 * Seismic Surge (1HP085) — Guardian Token - Aura.
 * Printed: "At the beginning of your action phase, destroy this, then your
 * next Guardian attack action card this turn costs {r} less to play."
 */
describe("Seismic Surge (1HP085) AAA", () => {
  it("happy: the Surge burns at the action phase and the next Guardian attack costs {r} less", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [seismicSurge],
        hand: [chokeslamBlue],
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );
    const Bravo = game.as(bravo);

    // Cycle to Bravo's second action phase: the Surge burns there and arms
    // the discount.
    Bravo.endTurn();
    game.helpers.untilIdle({ optionals: "decline" });
    game.as(dash).endTurn();

    // Chokeslam costs 4; the burned Surge discount brings it to 3 — the
    // seeded 3{r} pay for it exactly.
    seedResourcePoints(game, 3, bravo);
    Bravo.playAttack(chokeslamBlue);
    game.as(dash).defendWith();
    game.helpers.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Bravo).toHaveResourceCount(0);
    expect(Bravo.zone("arena")).not.toContain(seismicSurge.canonicalId);
    expectFabPlayer(game.as(dash)).toHaveLife(14);
  });

  it("boundary: a non-Guardian attack action card pays full price", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [seismicSurge],
        hand: [brutalAssaultBlue],
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(brutalAssaultBlue);
    game.as(dash).defendWith();
    game.helpers.closeCombat({ optionals: "decline", ordering: "listed" });

    // Brutal Assault costs 2 with no discount — the Surge latch is unspent.
    expectFabPlayer(Bravo).toHaveResourceCount(0);
    expectCombat(game).toBeClosed();
    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });
});
