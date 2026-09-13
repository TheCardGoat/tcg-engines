import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kassaiOfTheGoldenSand } from "../heroes/kassai-of-the-golden-sand.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { dawnblade } from "../weapons/dawnblade.ts";
import { snatchRed } from "./snatch.ts";
import { plowThroughRed } from "./plow-through.ts";

/**
 * Plow Through (MON113) — Warrior Action, cost 1, 3{d}.
 *
 * Printed: 'Your next weapon attack this turn gains +3{p} and "If this
 * weapon is defended by an attack action card, it gains +1{p} until end of
 * turn."
 * Go again'
 */

describe("Plow Through (MON113) AAA", () => {
  it("happy: the next weapon attack this turn gains +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [dawnblade],
        hand: [plowThroughRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.play(plowThroughRed);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });
    expectFabCard(Kassai, plowThroughRed).toBeIn("graveyard");
    expectFabPlayer(Kassai).toHaveAP(1);

    Kassai.activateAttack(dawnblade);
    // Dawnblade 3 + 3 = 6.
    expectCombat(game).toHaveAttackPower(6);
  });

  it("boundary: a non-weapon attack is not buffed", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [dawnblade],
        hand: [plowThroughRed, brutalAssaultBlue],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.play(plowThroughRed);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });

    Kassai.playAttack(brutalAssaultBlue);
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: an attack-action block grants the weapon +1{p} until end of turn", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [dawnblade],
        hand: [plowThroughRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);
    const Dash = game.as(dash);

    Kassai.play(plowThroughRed);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });
    Kassai.activateAttack(dawnblade);
    Dash.defendWith(snatchRed);
    game.passBoth();
    // Dawnblade 3 + Plow Through 3 + AAC-defend 1 = 7.
    expectCombat(game).toHaveAttackPower(7);
  });
});
