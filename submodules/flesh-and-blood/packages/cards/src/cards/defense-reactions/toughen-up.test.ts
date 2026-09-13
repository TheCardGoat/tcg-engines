import { describe, it } from "vitest";
import {
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dorinthea } from "../heroes/dorinthea.ts";
import { dash } from "../heroes/dash.ts";
import { dawnbladeResplendent } from "../weapons/dawnblade-resplendent.ts";
import { toughenUpBlue } from "./toughen-up.ts";

/**
 * Toughen Up Blue (DVR024) — Generic Defense Reaction.
 *
 * Printed: (vanilla — no abilities, d4)
 *   Cost 2, defense 4.
 *
 * AAA trio:
 * - Happy: defender plays Toughen Up (d4) against Dawnblade (power 2) → no damage.
 * - Boundary: insufficient resources → cannot play.
 * - Timing: vanilla — no timing interactions beyond reaction step.
 */

const MANUAL = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

describe("Toughen Up Blue (DVR024) AAA", () => {
  // ── Happy path ────────────────────────────────────────────────────────────

  it("happy: d4 defense reaction blocks Dawnblade power 2 — no damage", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [dawnbladeResplendent],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [toughenUpBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      MANUAL,
    );
    const Dori = game.as(dorinthea);
    const Dash = game.as(dash);

    Dori.must.activate(dawnbladeResplendent);
    game.advanceCombatTo("reaction");

    // Attacker has priority; pass to defender.
    Dori.pass();

    // Defender plays the defense reaction.
    Dash.must.playReaction(toughenUpBlue);

    game.helpers.resolveRestOfCombat();

    // Dawnblade power 2 ≤ Toughen Up defense 4 → no damage to Dash.
    expectFabPlayer(Dash).toHaveLife(20);
  });

  // ── Boundary ───────────────────────────────────────────────────────────────

  it("boundary: insufficient resources — cannot play reaction", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [dawnbladeResplendent],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [toughenUpBlue],
        resourcePoints: 1, // needs 2, only has 1
        actionPoints: 1,
        deck: 6,
      },
      MANUAL,
    );
    const Dori = game.as(dorinthea);
    const Dash = game.as(dash);

    Dori.must.activate(dawnbladeResplendent);
    game.advanceCombatTo("reaction");
    Dori.pass();

    expectFabUnplayable(() => Dash.must.playReaction(toughenUpBlue), /cannot be paid|unpayable/i);
  });

  // ── Timing / interaction ───────────────────────────────────────────────────

  it("timing: vanilla defense reaction — card goes to graveyard after combat", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [dawnbladeResplendent],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [toughenUpBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      MANUAL,
    );
    const Dori = game.as(dorinthea);
    const Dash = game.as(dash);

    Dori.must.activate(dawnbladeResplendent);
    game.advanceCombatTo("reaction");
    Dori.pass();
    Dash.must.playReaction(toughenUpBlue);
    game.helpers.resolveRestOfCombat();

    // Defense reaction consumed.
    expectFabCard(Dash, toughenUpBlue).toBeIn("graveyard");
  });
});
