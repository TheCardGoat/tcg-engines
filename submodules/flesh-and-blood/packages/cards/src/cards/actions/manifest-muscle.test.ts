import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { zen } from "../heroes/zen.ts";
import { spiritOfChristmasBlue } from "./spirit-of-christmas.ts";
import { snatchRed } from "./snatch.ts";
import { manifestMuscleBlue } from "./manifest-muscle.ts";

/**
 * Manifest Muscle, Blue (PEN270) — Mystic Action - Attack, cost 3, 5{p}, 3{d}.
 *
 * Printed: "If you've created a card this turn, this gets +1{p}."
 */

describe("Manifest Muscle (PEN270) AAA", () => {
  it("happy: after creating a Crouching Tiger this turn, this gets +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: zen,
        hand: [spiritOfChristmasBlue, manifestMuscleBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zen = game.as(zen);

    Zen.play(spiritOfChristmasBlue);
    game.untilIdle({ entityTargets: "minimum" });
    Zen.attackWith(manifestMuscleBlue);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(6);
  });

  it("boundary: without creating a card this turn, this stays printed 5{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: zen,
        hand: [manifestMuscleBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(zen).attackWith(manifestMuscleBlue);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(5);
  });

  it("timing: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: zen, hand: [manifestMuscleBlue], life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Zen = game.as(zen);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Zen.defendWith([manifestMuscleBlue]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Zen).toHaveLife(19);
    expectFabCard(Zen, manifestMuscleBlue).toBeIn("graveyard");
  });
});
