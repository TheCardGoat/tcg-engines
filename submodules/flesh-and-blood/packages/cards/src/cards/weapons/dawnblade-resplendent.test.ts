import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dorinthea } from "../heroes/dorinthea.ts";
import { dorintheaQuicksilverProdigy } from "../heroes/dorinthea-quicksilver-prodigy.ts";
import { dash } from "../heroes/dash.ts";
import { bladeFlashBlue } from "../attack-reactions/blade-flash.ts";
import { dawnbladeResplendent } from "./dawnblade-resplendent.ts";

/**
 * Dawnblade Resplendent (DVR002) — Warrior Weapon Sword 2H, power 2.
 *
 * Printed:
 *   Once per Turn Action - {r}: Attack
 *   The second time you attack with this each turn, it gets +1{p} until end of turn.
 *
 * AAA trio:
 * - Happy: equips in weapon1, activate → attack for base power 2.
 * - Boundary: 2H weapon occupies sole weapon slot (no off-hand).
 * - Timing: todo — 2nd attack +1 power requires extra activation grant.
 */

describe("Dawnblade Resplendent (DVR002) AAA", () => {
  // ── Happy path ────────────────────────────────────────────────────────────

  it("happy: equips in weapon1 and attacks for 2 power", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [dawnbladeResplendent],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
    );
    const Dori = game.as(dorinthea);

    expectFabCard(Dori, dawnbladeResplendent).toBeIn("weapon1");

    Dori.must.activate(dawnbladeResplendent);

    expect(game.combat()?.activeLink?.attackPower).toBe(2);
  });

  // ── Boundary ───────────────────────────────────────────────────────────────

  it("boundary: 2H weapon occupies sole weapon slot", () => {
    const game = FabTestEngine.start(
      { hero: dorinthea, weapon1: [dawnbladeResplendent], deck: 6 },
      { hero: dash, deck: 6 },
    );
    const Dori = game.as(dorinthea);

    expect(Dori.zone("weapon1")).toHaveLength(1);
    // 2H means no off-hand slot populated.
    expect(Dori.zone("weapon2")).toHaveLength(0);
  });

  // ── Timing / interaction ───────────────────────────────────────────────────

  // Deferred from intent-verb migration: this 2-attack flow interleaves a Blade
  // Flash reaction, a forced first-candidate sword target, and an optional
  // boolean between two activations; the passBoth sequencing is integral and
  // does not map cleanly onto playAttack/closeCombat. (happy/boundary migrated.)
  it("timing: second attack with Dawnblade gains +1 power until end of turn", () => {
    const game = FabTestEngine.start(
      {
        hero: dorintheaQuicksilverProdigy,
        weapon1: [dawnbladeResplendent],
        hand: [bladeFlashBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorintheaQuicksilverProdigy);

    Dori.must.activate(dawnbladeResplendent);
    game.advanceCombatTo("reaction");
    Dori.must.playReaction(bladeFlashBlue);
    const sword = game.pendingDecision();
    if (sword?.kind === "entity-target") {
      game.answerDecision(Dori.id, {
        kind: "entity-target",
        instanceIds: [sword.candidates[0]!.instanceId],
      });
    }
    game.passBoth();
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    game.helpers.resolveRestOfCombat();

    Dori.must.activate(dawnbladeResplendent);
    game.passBoth();
    game.passBoth();
    expect(game.combat()?.activeLink?.attackPower).toBe(3);
  });
});
