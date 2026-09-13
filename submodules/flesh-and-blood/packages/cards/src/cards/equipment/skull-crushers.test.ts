import { describe, expect, it } from "vitest";
import {
  expectCombat,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { kayo } from "../heroes/kayo.ts";
import { dash } from "../heroes/dash.ts";
import { highRollerRed } from "../actions/high-roller.ts";
import { packHuntRed } from "../actions/pack-hunt.ts";
import { skullCrushers } from "./skull-crushers.ts";

/**
 * Skull Crushers (EVR001) — Brute Arms d1, Battleworn.
 *
 * Printed: "Whenever you roll a 5 or 6 on a die, your Brute attacks gain +1{p}
 * this turn. Whenever you roll a 1 on a die, destroy Skull Crushers. Battleworn"
 */

// Seeds probed to commit a fixed die face for High Roller's roll (journal rng).
const FACE_FIVE_SEED = "skull-crushers-probe-3";
const FACE_ONE_SEED = "skull-crushers-probe-10";
const FACE_MID_SEED = "skull-crushers-probe-1";

describe("Skull Crushers (EVR001) AAA", () => {
  it("happy: rolling a 5 boosts your Brute attacks by +1{p} this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: kayo,
        arms: [skullCrushers],
        hand: [highRollerRed, packHuntRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, seed: FACE_FIVE_SEED },
    );
    const Kayo = game.as(kayo);

    Kayo.play(highRollerRed);
    game.untilIdle();
    expect(game.lastDieFace()).toBe(5);

    Kayo.playAttack(packHuntRed);
    expectCombat(game).toHaveAttackPower(7); // 6{p} + 1
  });

  it("timing: rolling a 1 destroys Skull Crushers", () => {
    const game = FabTestEngine.start(
      {
        hero: kayo,
        arms: [skullCrushers],
        hand: [highRollerRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, seed: FACE_ONE_SEED },
    );
    const Kayo = game.as(kayo);

    Kayo.play(highRollerRed);
    game.untilIdle();

    expect(game.lastDieFace()).toBe(1);
    expectFabCard(Kayo, skullCrushers).toBeIn("graveyard");
  });

  it("boundary: a mid roll neither boosts nor destroys", () => {
    const game = FabTestEngine.start(
      {
        hero: kayo,
        arms: [skullCrushers],
        hand: [highRollerRed, packHuntRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, seed: FACE_MID_SEED },
    );
    const Kayo = game.as(kayo);

    Kayo.play(highRollerRed);
    game.untilIdle();
    expect([2, 3, 4]).toContain(game.lastDieFace());

    Kayo.playAttack(packHuntRed);
    expectCombat(game).toHaveAttackPower(6); // base 6{p}, no boost
    expectFabCard(Kayo, skullCrushers).toBeIn("arms");
  });
});
