import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { cranialCrushBlue } from "../actions/cranial-crush.ts";
import { forgedForWarYellow } from "../actions/forged-for-war.ts";
import { hala } from "../heroes/hala.ts";
import { durendal } from "../weapons/durendal.ts";
import { sharpeningSparksRed } from "./sharpening-sparks.ts";

/**
 * Sharpening Sparks (MPW026) — Warrior Attack Reaction.
 *
 * Printed: Target sword attack gets +2{p} and "When this hits, sharpen this
 *          sword."
 */

describe("Sharpening Sparks (MPW026) AAA", () => {
  it("happy: a hitting sword attack sharpens", () => {
    const game = FabTestEngine.start(
      {
        hero: hala,
        weapon1: [durendal],
        hand: [sharpeningSparksRed],
        resourcePoints: 1,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      {
        hero: dash,
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(hala);
    const Dash = game.as(dash);

    Hala.activateAttack(durendal);
    expectCombat(game).toHaveAttackPower(3);
    game.toReaction();
    Hala.must.playReaction(sharpeningSparksRed);
    game.passBoth();
    expectCombat(game).toHaveAttackPower(5);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabCard(Hala, durendal).toHaveCounters(1);
    expectFabPlayer(Dash).toHaveLife(15);
  });

  it("boundary: a missed sword attack does not sharpen", () => {
    const game = FabTestEngine.start(
      {
        hero: hala,
        weapon1: [{ card: durendal, state: { powerCounterTotal: 1 } }],
        hand: [sharpeningSparksRed],
        resourcePoints: 1,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      {
        hero: dash,
        hand: [cranialCrushBlue, forgedForWarYellow],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(hala);
    const Dash = game.as(dash);

    Hala.activateAttack(durendal);
    Dash.defendWith(cranialCrushBlue, forgedForWarYellow);
    game.toReaction();
    Hala.must.playReaction(sharpeningSparksRed);
    game.passBoth();
    expectCombat(game).toHaveAttackPower(6);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabCard(Hala, durendal).toHaveCounters(1);
    expectFabPlayer(Dash).toHaveLife(20);
  });
});
