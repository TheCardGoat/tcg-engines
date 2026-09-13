import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { malice } from "../heroes/malice.ts";
import { clamberingCorpsesBlue } from "./clambering-corpses.ts";
import { restlessClericRed } from "./restless-cleric.ts";
import { restlessMagisterRed } from "./restless-magister.ts";
import { voxNecropolis } from "../weapons/vox-necropolis.ts";

/**
 * Clambering Corpses, Blue — Shadow Necromancer Action - Attack, 0{r} 1{p} 3{d}.
 *
 * Printed: "When this attacks, you may discard a zombie. If you do, this gets
 * +3{p} and go again. When this hits a hero, your zombie attacks this turn get
 * go again."
 */

describe("Clambering Corpses AAA", () => {
  it("happy: discarding a zombie pumps this to 4{p} and refunds the action point", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        hand: [clamberingCorpsesBlue, restlessClericRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);
    const Dash = game.as(dash);

    Malice.playAttack(clamberingCorpsesBlue, {
      optionals: "accept",
      entityTargets: "maximum",
    });
    expectFabCard(Malice, restlessClericRed).toBeIn("graveyard");
    expectCombat(game).toHaveAttackPower(4);

    Dash.defendWith();
    game.closeCombat();
    expectFabPlayer(Malice).toHaveAP(1);
    expectFabPlayer(Dash).toHaveLife(16);
  });

  it("boundary: declining the discard leaves this at 1{p} with no go again", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        hand: [clamberingCorpsesBlue, restlessClericRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);
    const Dash = game.as(dash);

    Malice.playAttack(clamberingCorpsesBlue, { optionals: "decline" });
    expectFabCard(Malice, restlessClericRed).toBeIn("hand");
    expectCombat(game).toHaveAttackPower(1);

    Dash.defendWith();
    game.closeCombat();
    expectFabPlayer(Malice).toHaveAP(0);
    expectFabPlayer(Dash).toHaveLife(19);
  });

  it("timing: hitting a hero still grants go again to later zombie attacks when the discard was declined", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        weapon1: [voxNecropolis],
        arena: [restlessMagisterRed],
        hand: [clamberingCorpsesBlue, restlessClericRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);
    const Dash = game.as(dash);

    Malice.playAttack(clamberingCorpsesBlue, { optionals: "decline" });
    Dash.defendWith();
    game.closeCombat();
    expectFabPlayer(Malice).toHaveAP(1);

    Malice.activateAttack(restlessMagisterRed);
    game.advanceUntil({ stopAt: "defend" });
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Malice).toHaveAP(1);
  });
});
