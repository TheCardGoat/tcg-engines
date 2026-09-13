import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nerveScalpel } from "../weapons/nerve-scalpel.ts";
import { gallantryGold } from "./gallantry-gold.ts";

/**
 * Gallantry Gold (BOL007) — Warrior Arms d1 Battleworn.
 *
 * Printed: Action - {r}, destroy Gallantry Gold: Your weapon attacks gain
 * +1{p} this turn. Go again
 *
 * Blade Cuff twin for the Weapon type-box: every weapon attack this turn is
 * buffed (count star), proven across two 1H Nerve Scalpels.
 */

describe("Gallantry Gold (BOL007) AAA", () => {
  it("happy: destroy the arms so this turn's weapon attacks gain +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [gallantryGold],
        weapon1: [nerveScalpel],
        hand: [],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.activate(gallantryGold);
    game.helpers.resolveUntilIdle();
    expectFabCard(Bravo, gallantryGold).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveAP(1);

    Bravo.activate(nerveScalpel);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(2);
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(18);
  });

  it("boundary: without the arms the weapon stays printed 1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [nerveScalpel],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.activate(nerveScalpel);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(1);
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(19);
  });

  it("timing: every weapon attack this turn is buffed, not just the first", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [gallantryGold],
        weapon1: [nerveScalpel],
        weapon2: [nerveScalpel],
        hand: [],
        resourcePoints: 5,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 40, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.activate(gallantryGold);
    game.helpers.resolveUntilIdle();

    Bravo.activate(nerveScalpel, { index: 0 });
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(2);
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();

    Bravo.activate(nerveScalpel, { index: 1 });
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(2);
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(36);
  });
});
