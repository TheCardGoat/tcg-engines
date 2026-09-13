import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { kassaiOfTheGoldenSand } from "../heroes/kassai-of-the-golden-sand.ts";
import { snatchRed } from "./snatch.ts";
import { secondSwingRed } from "./second-swing.ts";

/**
 * Second Swing (MON116) — Warrior Action, cost 1, 3{d}.
 *
 * Printed: "If you have attacked with a weapon this turn, your next attack
 * this turn gains +4{p}.
 * Go again"
 *
 * The condition is THIS TURN (not Combo last-attack). Play Second Swing
 * after a closed weapon attack; a non-attack Action cannot be played on an
 * open combat chain (CR 7.0.1a).
 */

describe("Second Swing (MON116) AAA", () => {
  it("happy: after a weapon attack this turn the next attack gains +4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [cintariSaber],
        hand: [secondSwingRed, snatchRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.activate(cintariSaber);
    game.advanceCombatTo("defend");
    game.as(dash).defendWith();
    game.helpers.resolveRestOfCombat();

    Kassai.play(secondSwingRed);
    game.helpers.untilIdle();

    Kassai.must.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    // Snatch 4 + 4 = 8.
    expectCombat(game).toHaveAttackPower(8);
  });

  it("boundary: without a weapon attack this turn the next attack stays printed 4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [cintariSaber],
        hand: [secondSwingRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.play(secondSwingRed);
    game.helpers.untilIdle();

    Kassai.must.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: go again refunds the play AP; the +4{p} latch expires at end of turn", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [cintariSaber],
        hand: [secondSwingRed, snatchRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.activate(cintariSaber);
    game.advanceCombatTo("defend");
    game.as(dash).defendWith();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Kassai).toHaveAP(1);
    Kassai.play(secondSwingRed);
    game.helpers.untilIdle();
    expectFabPlayer(Kassai).toHaveAP(1);

    Kassai.endTurn();
    game.as(dash).endTurn();
    game.helpers.untilIdle();

    Kassai.must.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(4);
  });
});
