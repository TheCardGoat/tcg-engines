import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  fabToken,
  expectWait,
} from "@tcg/flesh-and-blood-engine/testing";
import { bigSlickRed } from "../actions/big-slick.ts";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { goldenGrail } from "./golden-grail.ts";

/**
 * Golden Grail (MPW007) — Warrior Weapon Sword 2H 3{p}.
 *
 * Printed: Once per Turn Action - {r}{r} or destroy a Gold you control:
 * Attack. If this attack has wagered, it gets +1{p}.
 */

describe("Golden Grail (MPW007) AAA", () => {
  it("happy: pay {r}{r} to attack at printed 3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [goldenGrail],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activateAttack(goldenGrail);

    expectCombat(game).toHaveAttackPower(3);
    expectFabPlayer(Bravo).toHaveAP(0);
  });

  it("boundary: once-per-turn blocks a second attack even with Gold remaining", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [goldenGrail],
        arena: [fabToken("gold")],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activateAttack(goldenGrail, { alternativeCostIndex: 0 });
    expectFabPlayer(Bravo).toHaveTokenCount("gold", 1);
    expect(() => Bravo.activateAttack(goldenGrail, { alternativeCostIndex: 1 })).toThrow();
    expectFabPlayer(Bravo).toHaveTokenCount("gold", 1);
  });

  it("timing: destroy a Gold you control pays the alternative cost", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [goldenGrail],
        arena: [fabToken("gold")],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activateAttack(goldenGrail, { alternativeCostIndex: 1 });

    expectFabPlayer(Bravo).toHaveTokenCount("gold", 0);
    expectCombat(game).toHaveAttackPower(3);
  });

  it("happy: a wager-enabled attack gets +1{p} automatically without another decision", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [goldenGrail],
        hand: [bigSlickRed],
        resourcePoints: 5,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(bigSlickRed);
    game.untilIdle();
    Bravo.activateAttack(goldenGrail);

    expectWait(game).notToHaveDecision();
    expectCombat(game).toHaveAttackPower(9); // 3 base + 5 from Big Slick + 1 after wagering
  });

  it("timing: a later attack without a wager enabler returns to printed 3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [goldenGrail],
        arena: [fabToken("gold"), fabToken("gold")],
        hand: [bigSlickRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 30, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(bigSlickRed);
    game.untilIdle();
    Bravo.activateAttack(goldenGrail, {
      alternativeCostIndex: 1,
      entityTargets: "minimum",
    });
    expectCombat(game).toHaveAttackPower(9);
    Dash.defendWith();
    game.closeCombat();

    Bravo.endTurn();
    Dash.endTurn();
    game.untilIdle();

    Bravo.activateAttack(goldenGrail, {
      alternativeCostIndex: 1,
      entityTargets: "minimum",
    });

    expectCombat(game).toHaveAttackPower(3);
  });
});
