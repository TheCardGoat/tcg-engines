import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { ironrotPlate } from "../equipment/ironrot-plate.ts";
import { hyperX3 } from "../equipment/hyper-x3.ts";
import { ironrotHelm } from "../equipment/ironrot-helm.ts";
import { valdaSeismicImpact } from "../heroes/valda-seismic-impact.ts";
import { nimblismBlue } from "./nimblism.ts";
import { smeltingOfTheOldOnesRed } from "./smelting-of-the-old-ones.ts";

/**
 * Smelting of the Old Ones Red (MPG028) — Guardian Attack Action.
 *
 * Printed: Crush - When this deals 4 or more damage to a Guardian hero,
 * destroy all equipment they control with -1{d} counters.
 */

describe("Smelting of the Old Ones (MPG028) AAA", () => {
  it("happy: crush vs a Guardian hero destroys all of their -1{d} equipment", () => {
    const game = FabTestEngine.start(
      {
        hero: valdaSeismicImpact,
        hand: [smeltingOfTheOldOnesRed],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: bravo,
        life: 20,
        head: [{ card: ironrotHelm, state: { defenseCounterTotal: -1 } }],
        chest: [{ card: ironrotPlate, state: { defenseCounterTotal: -1 } }],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Valda = game.as(valdaSeismicImpact);
    const Bravo = game.as(bravo);

    Valda.playAttack(smeltingOfTheOldOnesRed);
    Bravo.defendWith();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toHaveLife(10);
    expectFabCard(Bravo, ironrotHelm).toBeIn("graveyard");
    expectFabCard(Bravo, ironrotPlate).toBeIn("graveyard");
  });

  it("boundary: crush vs a non-Guardian hero leaves their -1{d} equipment", () => {
    const game = FabTestEngine.start(
      {
        hero: valdaSeismicImpact,
        hand: [smeltingOfTheOldOnesRed],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        head: [{ card: hyperX3, state: { defenseCounterTotal: -1 } }],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Valda = game.as(valdaSeismicImpact);
    const Dash = game.as(dash);

    Valda.playAttack(smeltingOfTheOldOnesRed);
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(10);
    expectFabCard(Dash, hyperX3).toBeIn("head");
  });

  it("timing: less than 4 damage vs a Guardian leaves their -1{d} equipment", () => {
    const game = FabTestEngine.start(
      {
        hero: valdaSeismicImpact,
        hand: [smeltingOfTheOldOnesRed],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: bravo,
        life: 20,
        head: [{ card: ironrotHelm, state: { defenseCounterTotal: -1 } }],
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Valda = game.as(valdaSeismicImpact);
    const Bravo = game.as(bravo);

    Valda.playAttack(smeltingOfTheOldOnesRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith([nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue]);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toHaveLife(18);
    expectFabCard(Bravo, ironrotHelm).toBeIn("head");
  });
});
