import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { malice } from "../heroes/malice.ts";
import { dash } from "../heroes/dash.ts";
import { restlessCommanderRed } from "./restless-commander.ts";
import { restlessMagisterRed } from "./restless-magister.ts";
import { cintariSellsword } from "../tokens/cintari-sellsword.ts";
import { voxNecropolis } from "../weapons/vox-necropolis.ts";

/**
 * Restless Commander, Red (AMA014) — Shadow Necromancer Action - Zombie Ally,
 * 3{p}, Decay.
 *
 * Printed: "Zombies you control get +1{p}.\nDecay"
 */

describe("Restless Commander (AMA014) AAA", () => {
  it("happy: a zombie attack swings at 4{p} while the commander stays in the arena", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        weapon1: [voxNecropolis],
        arena: [restlessCommanderRed, restlessMagisterRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);
    const Dash = game.as(dash);

    // Vox arms the zombie in the arena; the commander stays behind and pumps it.
    // Both zombies are evaluated at +1{p} while the commander is in the arena.
    expectFabCard(Malice, restlessCommanderRed).toHavePower(4);
    expectFabCard(Malice, restlessMagisterRed).toHavePower(4);

    Malice.activateAttack(restlessMagisterRed);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(4);

    Dash.defendWith();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(16);
  });

  it("boundary: the +1{p} hits zombies only, not another ally in the arena", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        arena: [restlessCommanderRed, cintariSellsword],
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);

    expectFabCard(Malice, restlessCommanderRed).toHavePower(4);
    expectFabCard(Malice, cintariSellsword).toHavePower(3);
  });

  it("timing: without the commander a zombie attack is printed 3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        weapon1: [voxNecropolis],
        arena: [restlessMagisterRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);

    expectFabCard(Malice, restlessMagisterRed).toHavePower(3);
    Malice.activateAttack(restlessMagisterRed);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(3);
  });

  it("self: the commander keeps its own Zombie bonus while it is attacking", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        weapon1: [voxNecropolis],
        arena: [restlessCommanderRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);

    expectFabCard(Malice, restlessCommanderRed).toHavePower(4);
    Malice.activateAttack(restlessCommanderRed);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(4);
  });
});
