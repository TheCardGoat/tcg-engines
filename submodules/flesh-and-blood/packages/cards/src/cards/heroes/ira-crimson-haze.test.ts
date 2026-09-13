import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { headJabRed } from "../actions/head-jab.ts";
import { iraCrimsonHaze } from "./ira-crimson-haze.ts";

/**
 * Ira, Crimson Haze (IRA001) — printed continuous: "Your second attack each
 * turn gets +1{p}." Hero only; no other abilities tested.
 */

describe("Ira, Crimson Haze (IRA001) AAA", () => {
  it("happy: the second attack each turn gets +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: iraCrimsonHaze,
        hand: [snatchRed, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Ira = game.as(iraCrimsonHaze);

    Ira.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
    game.advanceCombatTo("resolution");
    Ira.playAttack(brutalAssaultBlue);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(5); // printed 4 + second-attack 1
  });

  it("boundary: the first attack of the turn stays at printed power", () => {
    const game = FabTestEngine.start(
      { hero: iraCrimsonHaze, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(iraCrimsonHaze).playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: the third attack does not keep the +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: iraCrimsonHaze,
        hand: [snatchRed, headJabRed, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Ira = game.as(iraCrimsonHaze);

    Ira.playAttack(snatchRed);
    game.advanceCombatTo("resolution");
    Ira.playAttack(headJabRed);
    game.advanceCombatTo("resolution");
    Ira.playAttack(brutalAssaultBlue);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(4); // third attack: printed only
  });
});
