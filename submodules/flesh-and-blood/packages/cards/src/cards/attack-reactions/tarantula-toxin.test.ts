import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakni } from "../heroes/arakni.ts";
import { grapheneChelicera } from "../weapons/graphene-chelicera.ts";
import { markOfTheBlackWidowRed } from "../actions/mark-of-the-black-widow.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { tarantulaToxinRed } from "./tarantula-toxin.ts";

describe("Tarantula Toxin (HNT015) AAA", () => {
  it("happy: target dagger attack gets +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [tarantulaToxinRed],
        weapon1: [grapheneChelicera],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.activate(grapheneChelicera);
    game.passBoth();
    game.advanceCombatTo("reaction");
    Arakni.must.playReaction(tarantulaToxinRed, {
      modeIds: ["BfCHDqCQHfNgqQGckhq7d:chooseDaggerOrDefenseMode:boostDagger"],
    });
    game.passBoth();

    expectCombat(game).toHaveAttackPower(4);
  });

  it("boundary: a non-dagger stealth attack cannot take the dagger-power mode", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [markOfTheBlackWidowRed, tarantulaToxinRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.attackWith(markOfTheBlackWidowRed);
    game.advanceCombatTo("reaction");
    expect(() =>
      Arakni.must.playReaction(tarantulaToxinRed, {
        modeIds: ["BfCHDqCQHfNgqQGckhq7d:chooseDaggerOrDefenseMode:boostDagger"],
      }),
    ).toThrow();
    expectCombat(game).toHaveAttackPower(3);
  });

  it("timing: a card defending a stealth attack gets -3{d} this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [markOfTheBlackWidowRed, tarantulaToxinRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [brutalAssaultBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.attackWith(markOfTheBlackWidowRed);
    game.advanceCombatTo("defend");
    Dash.defendWith(brutalAssaultBlue);
    game.advanceCombatTo("reaction");
    Arakni.must.playReaction(tarantulaToxinRed, {
      modeIds: ["BfCHDqCQHfNgqQGckhq7d:chooseDaggerOrDefenseMode:reduceDefenderDefense"],
    });
    game.helpers.closeCombat({ optionals: "decline" });

    // Brutal Assault Blue is 3{d}; −3{d} lets the 3{p} stealth attack deal 3.
    expectFabPlayer(Dash).toHaveLife(17);
  });
});
