import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { tuffnut } from "../heroes/tuffnut.ts";
import { snatchRed } from "../actions/snatch.ts";
import { commandAndConquerRed } from "../actions/command-and-conquer.ts";
import { emboldenedByTheCrowdYellow } from "./emboldened-by-the-crowd.ts";

/**
 * Emboldened by the Crowd, Yellow (PEN290) — Revered Defense Reaction.
 *
 * Printed: "If you've been cheered this turn, this costs {r}{r}{r} less to
 * play." (cost 3, 6{d})
 *
 * Tuffnut (Revered Brute hero) is seated as the defender: his instant tap
 * ability pitches the seeded 6{p} deck top during the attacker's reaction
 * window, cheering him THIS turn — the same turn the DR is played.
 */

describe("Emboldened by the Crowd (PEN290) AAA", () => {
  it("happy: cheered this turn, this costs 0{r} and blocks for 6{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, deck: 6 },
      {
        hero: tuffnut,
        hand: [emboldenedByTheCrowdYellow],
        deckTop: [commandAndConquerRed],
        resourcePoints: 0,
        life: 20,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Tuffnut = game.as(tuffnut);

    Dash.attackWith(snatchRed);
    game.toReaction("defender");
    // Instant tap ability with priority in the reaction window: the 6{p} deck
    // top is pitched and the crowd cheers Tuffnut this turn.
    Tuffnut.activate(tuffnut);
    game.passBoth();
    Dash.pass();
    Tuffnut.must.playReaction(emboldenedByTheCrowdYellow);
    game.helpers.resolveRestOfCombat();

    // 6{d} fully blocks Snatch's 4 power. The red pitch from Tuffnut's
    // ability left 1{r}; the DR's reduced cost 0 consumed none of it.
    expectFabPlayer(Tuffnut).toHaveLife(20);
    expectFabPlayer(Tuffnut).toHaveResourceCount(1);
    expectFabCard(Tuffnut, emboldenedByTheCrowdYellow).toBeIn("graveyard");
  });

  it("boundary: without a cheer this turn, 0{r} cannot pay the printed 3{r}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, deck: 6 },
      {
        hero: tuffnut,
        hand: [emboldenedByTheCrowdYellow],
        resourcePoints: 0,
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Tuffnut = game.as(tuffnut);

    Dash.attackWith(snatchRed);
    game.toReaction("defender");
    expectFabUnplayable(
      () => Tuffnut.must.playReaction(emboldenedByTheCrowdYellow),
      /cannot be paid|unpayable/i,
    );
    expectFabCard(Tuffnut, emboldenedByTheCrowdYellow).toBeIn("hand");
  });

  it("timing: paying the printed 3{r} without a cheer still blocks for 6{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, deck: 6 },
      {
        hero: tuffnut,
        hand: [emboldenedByTheCrowdYellow],
        resourcePoints: 3,
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Tuffnut = game.as(tuffnut);

    Dash.attackWith(snatchRed);
    game.toReaction("defender");
    Tuffnut.must.playReaction(emboldenedByTheCrowdYellow);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Tuffnut).toHaveLife(20);
    expectFabPlayer(Tuffnut).toHaveResourceCount(0);
    expectFabCard(Tuffnut, emboldenedByTheCrowdYellow).toBeIn("graveyard");
  });
});
