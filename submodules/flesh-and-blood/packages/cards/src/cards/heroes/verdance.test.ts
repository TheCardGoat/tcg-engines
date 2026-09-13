import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { verdance } from "./verdance.ts";
import { staffOfVerdantShoots } from "../weapons/staff-of-verdant-shoots.ts";
import { healingBalmBlue } from "../actions/healing-balm.ts";
import { weaveEarthBlue } from "../actions/weave-earth.ts";

/**
 * Hero behavior acceptance test — verdance (ROS014).
 *
 * Implements the per-hero AAA requirements from HEROES.md:
 * - Core mechanic: 4+ Earth banished → gain-life triggers optional 1 arcane damage
 * - Core interaction: declining optional deals no arcane
 * - Boundaries: fewer than 4 Earth → no trigger, opponent turn gain-life → no trigger,
 *   20hp Young health
 *
 * Signature weapon: Staff of Verdant Shoots (ROS015)
 */

const opponentHero = dash;

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

/** Four real authored Earth cards satisfy the banished-zone threshold. */
const fourEarth = [weaveEarthBlue, weaveEarthBlue, weaveEarthBlue, weaveEarthBlue];

// ---------------------------------------------------------------------------
// verdance (ROS014) — Elemental/Wizard/Young — 20hp
// Printed: If 4+ Earth banished, gain-life during your turn → optional 1
// arcane damage to any opposing target.
// ---------------------------------------------------------------------------

describe("verdance (ROS014)", () => {
  it("core mechanic: with 4+ Earth banished, gain life on your turn → optional 1 arcane to opponent", () => {
    const game = FabTestEngine.start(
      {
        hero: verdance,
        hand: [healingBalmBlue],
        banished: fourEarth,
        actionPoints: 1,
        deck: 6,
        life: 20,
      },
      { hero: opponentHero, deck: 6, life: 20 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Verdance = game.as(verdance);
    const Opp = game.as(opponentHero);

    // Act — fluent play Healing Balm (gain 1 life); accept optional ping.
    Verdance.play(healingBalmBlue);
    game.untilIdle({ optionals: "accept", entityTargets: "minimum" });

    // Assert — Verdance +1 life; opponent −1 from arcane.
    expectFabPlayer(Verdance).toHaveLife(21);
    expectFabPlayer(Opp).toHaveLife(19);
  });

  it("core interaction: declining the optional deals no arcane after life gain", () => {
    const game = FabTestEngine.start(
      {
        hero: verdance,
        hand: [healingBalmBlue],
        banished: fourEarth,
        actionPoints: 1,
        deck: 6,
        life: 20,
      },
      { hero: opponentHero, deck: 6, life: 20 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Verdance = game.as(verdance);
    const Opp = game.as(opponentHero);

    Verdance.play(healingBalmBlue);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });

    // Assert — Verdance gained life but opponent unchanged (optional declined).
    expectFabPlayer(Verdance).toHaveLife(21);
    expectFabPlayer(Opp).toHaveLife(20);
  });

  it("boundaries: fewer than 4 Earth banished → gain life does not open arcane optional", () => {
    const game = FabTestEngine.start(
      {
        hero: verdance,
        hand: [healingBalmBlue],
        banished: fourEarth.slice(1),
        actionPoints: 1,
        deck: 6,
        life: 20,
      },
      { hero: opponentHero, deck: 6, life: 20 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Verdance = game.as(verdance);
    const Opp = game.as(opponentHero);

    Verdance.play(healingBalmBlue);
    game.untilIdle({ optionals: "accept", entityTargets: "minimum" });

    // Assert — life gained but no arcane dealt (3 < 4 threshold).
    expectFabPlayer(Verdance).toHaveLife(21);
    expectFabPlayer(Opp).toHaveLife(20);
  });

  it("boundaries: gain life on opponent's turn does not fire the arcane optional", () => {
    // Opponent's Healing Balm is not Verdance gaining life — trigger only on
    // controller gain-life + turn-player condition.
    const game = FabTestEngine.start(
      {
        hero: verdance,
        banished: fourEarth,
        deck: 6,
        life: 20,
      },
      {
        hero: opponentHero,
        hand: [healingBalmBlue],
        actionPoints: 1,
        deck: 6,
        life: 20,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Verdance = game.as(verdance);
    const Opp = game.as(opponentHero);

    // Verdance ends turn; opponent plays Healing Balm.
    Verdance.endTurn();
    Opp.play(healingBalmBlue);
    game.untilIdle({ optionals: "accept", entityTargets: "minimum" });

    // Assert — opponent gained 1; Verdance unchanged and no arcane dealt.
    expectFabPlayer(Opp).toHaveLife(21);
    expectFabPlayer(Verdance).toHaveLife(20);
  });

  it("signature weapon: Staff of Verdant Shoots (ROS015) can be activated for Amp 1", () => {
    // Staff of Verdant Shoots — Once per Turn Action — {r}{r}{r}: Amp 1. Go again.
    const game = FabTestEngine.start(
      {
        hero: verdance,
        weapon1: [staffOfVerdantShoots],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Verdance = game.as(verdance);

    // Act — fluent weapon activation.
    Verdance.activate(staffOfVerdantShoots);
    game.passBoth();

    // Assert — resources paid; Amp 1 activated.
    expect(Verdance.resourcePoints()).toBe(0);
    // Go again refunds the action point (net AP cost 0).
    expect(Verdance.actionPoints()).toBe(1);
  });
});
