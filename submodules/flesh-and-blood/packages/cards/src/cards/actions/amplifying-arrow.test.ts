import { describe, it } from "vitest";
import {
  expectCombat,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { deathDealer } from "../shared/test-recipients.ts";
import { nimblismRed } from "./nimblism.ts";
import { amplifyingArrowYellow } from "./amplifying-arrow.ts";

/**
 * Amplifying Arrow (OUT100) — Ranger Arrow Attack, 2{p}.
 *
 * Printed: While this is face up in any zone, if it would gain {p}, instead
 * it gains that much plus 1.
 *
 * `type:replacement` `replaces:gain` never compiles. Re-encode to Back Heel
 * Kick `rule-modification` amplify gain-power (Errata Bulletin #6).
 */

describe("Amplifying Arrow (OUT100) AAA", () => {
  it("happy: a face-up arrow amps Nimblism +3{p} into +4", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: amplifyingArrowYellow, state: { faceDown: false } }],
        hand: [nimblismRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.play(nimblismRed);
    game.untilIdle({ ordering: "listed" });
    Azalea.playAttack(amplifyingArrowYellow, { from: "arsenal" });
    game.advanceUntil({ stopAt: "defend" });

    // Printed 2 + Nimblism 3 + amplify 1.
    expectCombat(game).toHaveAttackPower(6);
  });

  it("boundary: an arrow played from face-down arsenal is face-up before its attack gains power", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: amplifyingArrowYellow, state: { faceDown: true } }],
        hand: [nimblismRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.play(nimblismRed);
    game.untilIdle({ ordering: "listed" });
    Azalea.playAttack(amplifyingArrowYellow, { from: "arsenal" });
    game.advanceUntil({ stopAt: "defend" });

    expectCombat(game).toHaveAttackPower(6);
  });

  it("timing: without a {p} gain this stays printed 2", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: amplifyingArrowYellow, state: { faceDown: false } }],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(azalea).playAttack(amplifyingArrowYellow, { from: "arsenal" });
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(2);
  });
});
