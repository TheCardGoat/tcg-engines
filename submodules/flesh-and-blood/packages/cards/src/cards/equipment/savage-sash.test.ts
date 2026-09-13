import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { kayoBerserkerRunt } from "../heroes/kayo-berserker-runt.ts";
import { savageSash } from "./savage-sash.ts";
import { strengthRulesAllRed } from "../actions/strength-rules-all.ts";
import { runRoughshodBlue } from "../actions/run-roughshod.ts";

/**
 * Equipment behavior acceptance test — Savage Sash (AKO004).
 *
 * AAA trio:
 * - Happy: activate destroys self, grants cost −1 for p≥6 attack actions
 * - Boundary: attack action with p<6 is not affected by cost reduction
 * - Timing: cost reduction lasts this turn only
 *
 * Hero: Kayo, Berserker Runt (CRU002) — Brute/Young
 * FLUENT API ONLY.
 *
 * NOTE: Kayo's hero ability rolls a d6 on attacks with base p ≥ 6. The happy
 * path pins a known face 1 so this cost-reduction proof remains deterministic.
 */

describe("Savage Sash (AKO004) AAA", () => {
  // ── Happy path ────────────────────────────────────────────────────────────

  it("happy: activate destroys self, reduces cost of p≥6 attack action by 1", () => {
    const game = FabTestEngine.start(
      {
        hero: kayoBerserkerRunt,
        chest: [savageSash],
        hand: [strengthRulesAllRed],
        resourcePoints: 1, // printed cost 2, reduced to 1
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { ...FAB_MANUAL_HARNESS, seed: "kayo-runt-probe-1" },
    );
    const Kayo = game.as(kayoBerserkerRunt);

    // Activate Savage Sash — destroys itself.
    Kayo.activate(savageSash);
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    expectFabCard(Kayo, savageSash).toBeIn("graveyard");

    // Strength Rules All has printed cost 2, power 6. After Savage Sash
    // reduction, cost should be 1. Kayo has 1 resource — enough.
    Kayo.must.playAttack(strengthRulesAllRed);
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    expect(game.lastDieFace()).toBe(1);
    expectFabPlayer(game.as(dash)).toHaveLife(17);
  });

  // ── Boundary ───────────────────────────────────────────────────────────────

  it("boundary: attack action with p<6 not affected by cost reduction", () => {
    const game = FabTestEngine.start(
      {
        hero: kayoBerserkerRunt,
        chest: [savageSash],
        hand: [runRoughshodBlue],
        resourcePoints: 0, // Run Roughshod costs 1, p=5 < 6, no reduction
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
    );
    const Kayo = game.as(kayoBerserkerRunt);

    Kayo.activate(savageSash);

    // Run Roughshod (p=5 < 6) should NOT get cost reduction.
    // Kayo has 0 resources — play should fail.
    expect(() => Kayo.must.playAttack(runRoughshodBlue)).toThrow();
  });

  // ── Timing / interaction ───────────────────────────────────────────────────

  it("timing: cost reduction does not persist across turns", () => {
    const game = FabTestEngine.start(
      {
        hero: kayoBerserkerRunt,
        chest: [savageSash],
        hand: [strengthRulesAllRed],
        resourcePoints: 1, // would be enough with reduction, not without
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, deck: 6 },
    );
    const Kayo = game.as(kayoBerserkerRunt);

    // Activate Savage Sash on this turn.
    Kayo.activate(savageSash);

    // End turn without playing Strength Rules All.
    Kayo.endTurn();

    // On next turn, cost reduction expired. Strength Rules All costs 2
    // but Kayo only has 1 resource — play should fail.
    expect(() => Kayo.must.playAttack(strengthRulesAllRed)).toThrow();
  });
});
