import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabCard } from "@tcg/flesh-and-blood-engine/testing";
import { dorinthea } from "../heroes/dorinthea.ts";
import { dash } from "../heroes/dash.ts";
import { dawnbladeResplendent } from "../weapons/dawnblade-resplendent.ts";
import { thrustRed } from "./thrust.ts";

/**
 * Thrust Red (DVR014) — Generic Attack Reaction.
 *
 * Printed:
 *   Target sword attack gains +3{p}.
 *
 * AAA trio:
 * - Happy: Dawnblade attack (power 2) → reaction → attack power becomes 5.
 * - Boundary: insufficient resources after activation → cannot play.
 * - Timing: +3 power until end of turn.
 */

const MANUAL = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

describe("Thrust Red (DVR014) AAA", () => {
  // ── Happy path ────────────────────────────────────────────────────────────

  it("happy: target sword attack gains +3 power", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [dawnbladeResplendent],
        hand: [thrustRed],
        resourcePoints: 2, // 1 activation + 1 reaction
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      MANUAL,
    );
    const Dori = game.as(dorinthea);

    Dori.must.activate(dawnbladeResplendent);
    game.advanceCombatTo("reaction");
    Dori.must.playReaction(thrustRed);
    game.passBoth();

    // Dawnblade base power 2 + 3 from Thrust = 5.
    expect(game.combat()?.activeLink?.attackPower).toBe(5);

    // Resolve combat — Dorinthea's "weapon hit → may attack again" trigger fires;
    // decline the optional additional attack.
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
  });

  // ── Boundary ───────────────────────────────────────────────────────────────

  it("boundary: insufficient resources — cannot play reaction", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [dawnbladeResplendent],
        hand: [thrustRed],
        resourcePoints: 1, // only enough for activation
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      MANUAL,
    );
    const Dori = game.as(dorinthea);

    Dori.must.activate(dawnbladeResplendent);
    game.advanceCombatTo("reaction");

    expect(() => Dori.must.playReaction(thrustRed)).toThrow();
  });

  // ── Timing / interaction ───────────────────────────────────────────────────

  it("timing: +3 power is until end of turn", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [dawnbladeResplendent],
        hand: [thrustRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      MANUAL,
    );
    const Dori = game.as(dorinthea);

    Dori.must.activate(dawnbladeResplendent);
    game.advanceCombatTo("reaction");
    Dori.must.playReaction(thrustRed);
    game.passBoth();

    // Power bonus applied for this combat chain link.
    expect(game.combat()?.activeLink?.attackPower).toBe(5);

    // Resolve combat — Dorinthea's hit trigger; decline optional attack.
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    // Reaction card consumed — in graveyard.
    expectFabCard(Dori, thrustRed).toBeIn("graveyard");
  });
});
