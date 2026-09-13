import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { seismicSurge } from "../tokens/seismic-surge.ts";
import { solidGroundBlue } from "./solid-ground.ts";

/**
 * Solid Ground Blue (MPG019) — Guardian Defense Reaction.
 *
 * Printed: This costs {r} less to play for each Seismic Surge you control.
 */

describe("Solid Ground (MPG019) AAA", () => {
  it("happy: three Seismic Surges let this play for 0{r} and block Snatch", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        hand: [solidGroundBlue],
        arena: [seismicSurge, seismicSurge, seismicSurge],
        resourcePoints: 0,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    Dash.pass();
    Bravo.play(solidGroundBlue);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toHaveLife(20);
    expectFabPlayer(Bravo).toHaveResourceCount(0);
    expectFabCard(Bravo, solidGroundBlue).toBeIn("graveyard");
  });

  it("boundary: with no Surges and no resources it cannot be played", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [solidGroundBlue], resourcePoints: 0, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    Dash.pass();

    expectFabUnplayable(() => Bravo.play(solidGroundBlue), /cannot be paid/i);
    expectFabCard(Bravo, solidGroundBlue).toBeIn("hand");
  });

  it("timing: the cost reduction is live before payment, not after the DR resolves", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        hand: [solidGroundBlue],
        arena: [seismicSurge],
        resourcePoints: 2,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    Dash.pass();
    Bravo.play(solidGroundBlue);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toHaveResourceCount(0);
    expectFabCard(Bravo, solidGroundBlue).toBeIn("graveyard");
  });
});
