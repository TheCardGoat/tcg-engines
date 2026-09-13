import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultRed } from "../actions/brutal-assault.ts";
import { heartOfFyendalBlue } from "../resources/heart-of-fyendal.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { bastionOfDuty } from "../equipment/bastion-of-duty.ts";
import { withstandRed } from "./withstand.ts";

describe("Withstand (DYN042/043/044) AAA", () => {
  it("happy: the next Guardian off-hand defend gains +6{d} through the combat chain", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [brutalAssaultRed, brutalAssaultRed],
        resourcePoints: 6,
        actionPoints: 2,
        deck: 4,
      },
      {
        hero: bravo,
        hand: [withstandRed],
        weapon2: [bastionOfDuty],
        resourcePoints: 2,
        life: 20,
        deck: 4,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(brutalAssaultRed);
    game.advanceCombatTo("reaction");
    Dash.pass();
    Bravo.play(withstandRed);
    game.passBoth();
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Bravo).toHaveLife(14);

    Dash.attackWith(brutalAssaultRed);
    Bravo.defendWith(bastionOfDuty);
    game.closeCombat();
    expectFabPlayer(Bravo).toHaveLife(14);
  });

  it("boundary: a non-Guardian off-hand defender receives no bonus", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [brutalAssaultRed, brutalAssaultRed],
        resourcePoints: 6,
        actionPoints: 2,
        deck: 4,
      },
      {
        hero: bravo,
        hand: [withstandRed, nimblismBlue],
        weapon2: [bastionOfDuty],
        resourcePoints: 2,
        life: 20,
        deck: 4,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(brutalAssaultRed);
    game.advanceCombatTo("reaction");
    Dash.pass();
    Bravo.play(withstandRed);
    game.passBoth();
    game.helpers.resolveRestOfCombat();

    Dash.attackWith(brutalAssaultRed);
    Bravo.defendWith(nimblismBlue);
    game.closeCombat();
    expectFabPlayer(Bravo).toHaveLife(10);
  });

  it("timing: the armed trigger expires at turn end", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [brutalAssaultRed, brutalAssaultRed, heartOfFyendalBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 4,
      },
      {
        hero: bravo,
        hand: [withstandRed],
        weapon2: [bastionOfDuty],
        resourcePoints: 2,
        life: 20,
        deck: 4,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(brutalAssaultRed);
    game.advanceCombatTo("reaction");
    Dash.pass();
    Bravo.play(withstandRed);
    game.passBoth();
    game.helpers.resolveRestOfCombat();
    game.closeCombat();
    expectFabPlayer(Bravo).toHaveLife(14);

    Dash.endTurn();
    Bravo.endTurn();
    game.helpers.untilIdle();

    Dash.attackWith(brutalAssaultRed, { pitch: [heartOfFyendalBlue] });
    Bravo.defendWith(bastionOfDuty);
    game.closeCombat();
    expectFabPlayer(Bravo).toHaveLife(10);
  });
});
