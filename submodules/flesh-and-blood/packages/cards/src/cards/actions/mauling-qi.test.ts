import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { crouchingTiger } from "./crouching-tiger.ts";
import { katsu } from "../heroes/katsu.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { maulingQiRed } from "./mauling-qi.ts";

describe("Mauling Qi (TCC088) AAA", () => {
  it("happy: after Crouching Tiger on the same chain a hit deals 1 extra damage", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [crouchingTiger, maulingQiRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(crouchingTiger);
    game.as(dash).defendWith();
    game.advanceCombatTo("resolution");

    Katsu.playAttack(maulingQiRed);
    expectCombat(game).toHaveAttackPower(5);
    game.as(dash).defendWith();
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    game.untilIdle({ optionals: "decline", ordering: "listed" });
    // 5 physical + Combo 1 generic to the opposing hero.
    expectFabPlayer(game.as(dash)).toHaveLife(14);
  });

  it("boundary: as the first link a hit deals only the 5 physical", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [maulingQiRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(maulingQiRed);
    expectCombat(game).toHaveAttackPower(5);
    game.as(dash).defendWith();
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(game.as(dash)).toHaveLife(15);
  });

  it("timing: a closed Crouching Tiger chain does not arm Combo on a fresh chain", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [crouchingTiger, maulingQiRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(crouchingTiger);
    game.as(dash).defendWith();
    game.closeCombat({ optionals: "decline" });

    Katsu.playAttack(maulingQiRed);
    game.as(dash).defendWith();
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(game.as(dash)).toHaveLife(15);
  });

  it("boundary: Brutal Assault as the last attack does not deal the Combo 1", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [brutalAssaultBlue, maulingQiRed],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(brutalAssaultBlue);
    game.as(dash).defendWith();
    game.advanceCombatTo("resolution");
    Katsu.playAttack(maulingQiRed);
    game.as(dash).defendWith();
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    // 4 (Brutal Assault) + 5 (Mauling Qi), no Combo.
    expectFabPlayer(game.as(dash)).toHaveLife(11);
  });
});
