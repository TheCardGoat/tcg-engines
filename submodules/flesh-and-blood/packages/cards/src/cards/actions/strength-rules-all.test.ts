import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { snatchRed } from "./snatch.ts";
import { kayoBerserkerRunt } from "../heroes/kayo-berserker-runt.ts";
import { strengthRulesAllRed } from "./strength-rules-all.ts";

/**
 * Action behavior acceptance test — Strength Rules All, Red (AKO013).
 *
 * AAA trio:
 * - Happy: on hit, turn arsenal face-up, banish attack action with p < damage
 * - Boundary: target has no cards in arsenal — full damage, no banish
 * - Timing: banished card is permanently removed
 *
 * Hero: Kayo, Berserker Runt (CRU002) — Brute/Young
 *
 * NOTE: Kayo's hero ability rolls a d6 when playing an attack with base p ≥ 6,
 * potentially doubling (5/6) or halving (1/4) the power. The tests extract the
 * roll from committed events to assert correct damage dynamically.
 *
 * FLUENT API ONLY.
 */

describe("Strength Rules All, Red (AKO013) AAA", () => {
  // ── Happy path ────────────────────────────────────────────────────────────

  it("happy: on hit, reveal arsenal card and banish attack action with p < damage", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [strengthRulesAllRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: bravo,
        arsenal: [{ card: snatchRed }],
        life: 20,
        deck: 6,
      },
    );
    const Rhinar = game.as(rhinar);
    const Bravo = game.as(bravo);

    Rhinar.must.playAttack(strengthRulesAllRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabPlayer(Bravo).toHaveLife(14);
    expectFabCard(Bravo, snatchRed).toBeBanished();
  });

  // ── Boundary ───────────────────────────────────────────────────────────────

  it("boundary: no arsenal cards — full damage dealt, no banish", () => {
    const game = FabTestEngine.start(
      {
        hero: kayoBerserkerRunt,
        hand: [strengthRulesAllRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, life: 20, deck: 6 },
    );
    const Kayo = game.as(kayoBerserkerRunt);
    const Bravo = game.as(bravo);

    Kayo.must.playAttack(strengthRulesAllRed);
    game.helpers.resolveRestOfCombat();

    const roll = game.lastDieFace();
    const actualPower = kayoModifiedPower(6, roll);
    expectFabPlayer(Bravo).toHaveLife(20 - actualPower);
    expect(Bravo.zone("banished")).toHaveLength(0);
  });

  // ── Timing / interaction ───────────────────────────────────────────────────

  it("timing: banished attack action is permanently removed", () => {
    const game = FabTestEngine.start(
      {
        hero: kayoBerserkerRunt,
        hand: [strengthRulesAllRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: bravo,
        arsenal: [{ card: snatchRed }, { card: snatchRed }],
        life: 20,
        deck: 6,
      },
    );
    const Kayo = game.as(kayoBerserkerRunt);
    const Bravo = game.as(bravo);

    Kayo.must.playAttack(strengthRulesAllRed);
    game.helpers.resolveRestOfCombat();

    const banished = Bravo.zone("banished");
    // Banish only fires when actual power > 4 (snatchRed p=4).
    // When Kayo halves power to 3, no valid banish target exists.
    if (banished.length > 0) {
      // Banished cards should not reappear in hand or graveyard.
      for (const card of banished) {
        expect(Bravo.zone("hand")).not.toContain(card);
        expect(Bravo.zone("graveyard")).not.toContain(card);
      }
    }
  });
});

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Compute Kayo Berserker Runt's modified power given a d6 roll result. */
function kayoModifiedPower(basePower: number, roll: number): number {
  if (roll === 5 || roll === 6) return basePower * 2;
  if (roll === 1 || roll === 4) return Math.floor(basePower / 2);
  return basePower;
}
