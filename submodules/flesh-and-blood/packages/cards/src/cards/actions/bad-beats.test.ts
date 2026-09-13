import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { packHuntBlue } from "./pack-hunt.ts";
import { badBeatsRed } from "./bad-beats.ts";

/**
 * Bad Beats (EVR014) — Brute Action, cost 0, go again.
 *
 * Printed: "Roll a 6 sided die. If the number rolled is a 4, 5, or 6, the
 * next Brute attack action card you play this turn gains +5{p}. Go again"
 */

const FACE_FOUR_OR_HIGHER_SEED = "kayo-runt-probe-1";
const FACE_ONE_SEED = "bad-beats-probe-3";

describe("Bad Beats (EVR014) AAA", () => {
  it("happy: a 4+ roll gives the next Brute attack +5{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [badBeatsRed, packHuntBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      { ...FAB_MANUAL_HARNESS, seed: FACE_FOUR_OR_HIGHER_SEED },
    );
    const Rhinar = game.as(rhinar);

    Rhinar.play(badBeatsRed);
    game.untilIdle({ ordering: "listed" });
    expect(game.lastDieFace()).toBeGreaterThanOrEqual(4);
    Rhinar.playAttack(packHuntBlue);

    expectCombat(game).toHaveAttackPower(9);
  });

  it("boundary: a 1–3 roll leaves the next Brute attack at printed power", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [badBeatsRed, packHuntBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      { ...FAB_MANUAL_HARNESS, seed: FACE_ONE_SEED },
    );
    const Rhinar = game.as(rhinar);

    Rhinar.play(badBeatsRed);
    game.untilIdle({ ordering: "listed" });
    expect(game.lastDieFace()).toBeLessThanOrEqual(3);
    Rhinar.playAttack(packHuntBlue);

    expectCombat(game).toHaveAttackPower(4);
  });
});
