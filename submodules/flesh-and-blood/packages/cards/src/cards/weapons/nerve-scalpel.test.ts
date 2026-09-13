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
import { arakniMarionette } from "../heroes/arakni-marionette.ts";
import { swingBigRed } from "../actions/swing-big.ts";
import { snatchRed } from "../actions/snatch.ts";
import { unmovableRed } from "../defense-reactions/unmovable.ts";
import { nerveScalpel } from "./nerve-scalpel.ts";

describe("Nerve Scalpel (OUT005) AAA", () => {
  it("happy: after this hits, a defense reaction they play has −1{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [nerveScalpel],
        hand: [swingBigRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [unmovableRed], resourcePoints: 3, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.activate(nerveScalpel);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(19);

    Bravo.attackWith(swingBigRed);
    Dash.defendWith();
    Bravo.pass();
    Dash.pass();
    Bravo.pass();
    Dash.play(unmovableRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });
    expectFabPlayer(Dash).toHaveLife(17);
  });

  it("happy: the weapon hits for 1 and grants an action point", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        weapon1: [nerveScalpel],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakniMarionette);

    Arakni.activate(nerveScalpel);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(19);
    expectFabPlayer(Arakni).toHaveAP(1);
  });

  it("boundary: a hand attack-action defend is not a reaction and stays at printed {d}", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        weapon1: [nerveScalpel],
        hand: [snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakniMarionette);
    const Dash = game.as(dash);

    Arakni.activate(nerveScalpel);
    game.helpers.resolveRestOfCombat();

    Arakni.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Dash.defendWith(snatchRed);
    game.passBoth();

    expectFabCard(Dash, snatchRed).toHaveDefense(2);
  });

  it("timing: the attack itself has piercing and go again", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        weapon1: [nerveScalpel],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakniMarionette);

    Arakni.activate(nerveScalpel);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(1);
    expectCombat(game).toHaveKeyword("piercing");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Arakni).toHaveAP(1);
  });
});
