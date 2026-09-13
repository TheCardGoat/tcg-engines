import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { iraScarletRevenger } from "../heroes/ira-scarlet-revenger.ts";
import { harmonizedKodachi } from "../weapons/harmonized-kodachi.ts";
import { snatchRed } from "./snatch.ts";
import { saltTheWoundYellow } from "./salt-the-wound.ts";

/**
 * Salt the Wound (IRA004) — "This gets +1{p} for each attack that has hit
 * this combat chain." Printed 2{p}.
 */

describe("Salt the Wound (IRA004) AAA", () => {
  it("happy: one hit on the chain makes this 3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: iraScarletRevenger,
        hand: [saltTheWoundYellow],
        weapon1: [harmonizedKodachi],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Ira = game.as(iraScarletRevenger);

    Ira.activateAttack(harmonizedKodachi);
    game.advanceCombatTo("resolution");
    Ira.playAttack(saltTheWoundYellow);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(3);
  });

  it("boundary: with no hits this stays printed 2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: iraScarletRevenger,
        hand: [saltTheWoundYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(iraScarletRevenger).playAttack(saltTheWoundYellow);
    expectCombat(game).toHaveAttackPower(2);
  });

  it("timing: a fully blocked prior attack is not a hit", () => {
    const game = FabTestEngine.start(
      {
        hero: iraScarletRevenger,
        hand: [saltTheWoundYellow],
        weapon1: [harmonizedKodachi],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Ira = game.as(iraScarletRevenger);

    Ira.activateAttack(harmonizedKodachi);
    game.advanceCombatTo("defend");
    game.as(dash).defendWith(snatchRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    Ira.playAttack(saltTheWoundYellow);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(2);
  });
});
