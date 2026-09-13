import { describe, expect, it } from "vitest";
import {
  expectCombat,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { brutalAssaultRed } from "../actions/brutal-assault.ts";
import { snatchRed } from "../actions/snatch.ts";
import { kayoBerserkerRunt } from "./kayo-berserker-runt.ts";

/**
 * Kayo, Berserker Runt (CRU002) — Brute Young hero.
 *
 * Printed: Whenever you play an attack action card with base power 6 or more
 * {p}, roll a 6 sided die. On 1 to 4: Halve the attack's base {p}, rounded
 * down. On 5 or 6: Double the attack's base {p}.
 */

// Seeds probed to commit a fixed die face for the hero roll (journal rng).
const FACE_SIX_SEED = "kayo-runt-probe-1";
const FACE_ONE_SEED = "kayo-runt-probe-5";
const FACE_TWO_OR_THREE_SEED = "kayo-runt-probe-2";

describe("Kayo, Berserker Runt (CRU002) AAA", () => {
  it("happy: rolling a 6 doubles the 6{p} attack's base {p} to 12", () => {
    const game = FabTestEngine.start(
      {
        hero: kayoBerserkerRunt,
        hand: [brutalAssaultRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, seed: FACE_SIX_SEED },
    );
    const Kayo = game.as(kayoBerserkerRunt);

    Kayo.playAttack(brutalAssaultRed);

    expect(game.lastDieFace()).toBe(6);
    expectCombat(game).toHaveAttackPower(12);
  });

  it("boundary: a 4{p} attack does not roll or change base {p}", () => {
    const game = FabTestEngine.start(
      {
        hero: kayoBerserkerRunt,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayoBerserkerRunt);

    Kayo.playAttack(snatchRed);

    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: rolling a 1 halves the 6{p} attack's base {p} to 3", () => {
    const game = FabTestEngine.start(
      {
        hero: kayoBerserkerRunt,
        hand: [brutalAssaultRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, seed: FACE_ONE_SEED },
    );
    const Kayo = game.as(kayoBerserkerRunt);

    Kayo.playAttack(brutalAssaultRed);

    expect(game.lastDieFace()).toBe(1);
    expectCombat(game).toHaveAttackPower(3);
  });

  it("boundary: rolling a 2 or 3 also halves the attack's base {p}", () => {
    const game = FabTestEngine.start(
      {
        hero: kayoBerserkerRunt,
        hand: [brutalAssaultRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, seed: FACE_TWO_OR_THREE_SEED },
    );
    const Kayo = game.as(kayoBerserkerRunt);

    Kayo.playAttack(brutalAssaultRed);

    expect([2, 3]).toContain(game.lastDieFace());
    expectCombat(game).toHaveAttackPower(3);
  });
});
