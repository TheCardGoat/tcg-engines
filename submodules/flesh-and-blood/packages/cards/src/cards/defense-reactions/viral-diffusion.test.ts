import { describe, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";

import { throttleRed } from "../actions/throttle.ts";
import { drMortimer } from "../heroes/dr-mortimer.ts";
import { viralDiffusionRed } from "./viral-diffusion.ts";

/**
 * Viral Diffusion (AMO019) — Assassin Defense Reaction - Trap (Mortimer
 * Specialization), cost 3, 4{d}.
 *
 * Printed: "When this defends, create a Frailty, Inertia, and Bloodrot Pox
 * token under the attacking hero's control."
 */

describe("Viral Diffusion (AMO019) AAA", () => {
  it("happy: defending gives the attacking hero a Frailty, Inertia, and Bloodrot Pox", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [throttleRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: drMortimer,
        hand: [viralDiffusionRed],
        life: 20,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Mortimer = game.as(drMortimer);

    Dash.playAttack(throttleRed);
    game.toReaction("defender");
    Mortimer.must.playReaction(viralDiffusionRed);
    game.passBoth();
    game.passBoth();

    // 4 power vs 4{d} — fully blocked, and all three Pox tokens land on Dash.
    expectFabPlayer(Mortimer).toHaveLife(20);
    expectFabPlayer(Dash).toHaveTokenCount("frailty", 1);
    expectFabPlayer(Dash).toHaveTokenCount("inertia", 1);
    expectFabPlayer(Dash).toHaveTokenCount("bloodrot-pox", 1);
  });

  it("timing: an unblocked attack still delivers the Pox to the attacking hero", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [throttleRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: drMortimer,
        hand: [viralDiffusionRed],
        life: 20,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Mortimer = game.as(drMortimer);

    Dash.playAttack(throttleRed);
    game.toReaction("defender");
    Mortimer.must.playReaction(viralDiffusionRed);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Mortimer).toHaveLife(18); // 6{p} vs 4{d} — 2 damage
    expectFabPlayer(Dash).toHaveTokenCount("frailty", 1);
    expectFabPlayer(Dash).toHaveTokenCount("inertia", 1);
    expectFabPlayer(Dash).toHaveTokenCount("bloodrot-pox", 1);
  });
});
