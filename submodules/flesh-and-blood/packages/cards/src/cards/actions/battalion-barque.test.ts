import { describe, it } from "vitest";
import {
  expectCombat,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { nimblismRed } from "./nimblism.ts";
import { autumnSTouchBlue } from "./autumn-s-touch.ts";
import { battalionBarqueRed } from "./battalion-barque.ts";

/**
 * Battalion Barque (AGB008) — Pirate Action-Attack (red).
 *
 * Printed:
 *   High Tide - If there are 2 or more blue cards in your pitch zone, this
 *   gets +2{p}.
 *
 * fab-rules Mode B handoff:
 *   citations: CR 5.3 (resolution abilities), CR 6.2 (layer-continuous
 *     numeric modification), CR 2.1 + CR 2.8 (color: blue = pitch value 3),
 *     glossary label keyword High Tide (attack actions conditional on two or
 *     more blue cards in the pitch zone).
 *   behaviorConstraints:
 *     - The +2{p} applies only when, as the attack resolves, the controller's
 *       pitch zone contains at least 2 blue cards.
 *     - Any near-miss (exactly 1 blue card, or pitch cards that are not blue)
 *       leaves the attack at its printed 7{p}.
 *   testImplications:
 *     - Assert active-link attack power 9 with 2 blues in pitch, and 7 for
 *       both the single-blue and two-red contrasts.
 */

describe("Battalion Barque family AAA", () => {
  it("happy: High Tide with 2 blues in the pitch zone grants +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [battalionBarqueRed],
        pitch: [nimblismBlue, autumnSTouchBlue],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.attackWith(battalionBarqueRed);
    // Base 7 + 2 from High Tide = 9.
    expectCombat(game).toHaveAttackPower(9);
  });

  it("boundary: only one blue card in the pitch zone keeps the printed 7{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [battalionBarqueRed],
        pitch: [nimblismBlue, nimblismRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.attackWith(battalionBarqueRed);
    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: two non-blue pitch cards do not satisfy High Tide", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [battalionBarqueRed],
        pitch: [nimblismRed, nimblismRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.attackWith(battalionBarqueRed);
    expectCombat(game).toHaveAttackPower(7);
  });
});
