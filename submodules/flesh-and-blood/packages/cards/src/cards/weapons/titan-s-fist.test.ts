import { describe, expect, it } from "vitest";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { oldhimGrandfatherOfEternity } from "../heroes/oldhim-grandfather-of-eternity.ts";
import { titanSFist } from "./titan-s-fist.ts";
import { mulchBlue } from "../actions/mulch.ts";

/**
 * Weapon behavior acceptance test — Titan's Fist (ELE202).
 *
 * AAA trio:
 * - Happy: 3{r} attack with base power 3
 * - Boundary: cost 3+ card in pitch zone grants +1{p} (power → 4)
 * - Timing: once per turn
 *
 * Hero: Oldhim Grandfather of Eternity (ELE001) — Elemental/Guardian
 * Pitch fixture: Mulch Blue (ELE021) — cost 4, Blue/3 pitch
 * FLUENT API ONLY.
 */

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

describe("Titan's Fist (ELE202) AAA", () => {
  // ── Happy path ────────────────────────────────────────────────────────────

  it("happy: activate costs 3 resources, opens combat with power 3", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhimGrandfatherOfEternity,
        weapon1: [titanSFist],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      manual,
    );

    game.as(oldhimGrandfatherOfEternity).activate(titanSFist);
    game.passBoth();

    expect(game.combat()?.open).toBe(true);
    expect(game.combat()?.activeLink?.attackPower).toBe(3);
  });

  // ── Conditional +1{p} from pitch zone ─────────────────────────────────────

  it("happy: cost 3+ card in pitch zone grants +1{p} (power → 4)", () => {
    // Seed mulchBlue (cost 4, Blue/3) directly into pitch zone so the
    // conditional +1P triggers. Seed 3 resource points to pay the cost.
    const game = FabTestEngine.start(
      {
        hero: oldhimGrandfatherOfEternity,
        weapon1: [titanSFist],
        pitch: [mulchBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      manual,
    );

    game.as(oldhimGrandfatherOfEternity).activate(titanSFist);
    game.passBoth();

    expect(game.combat()?.activeLink?.attackPower).toBe(4); // 3 base + 1 from pitch condition
  });

  it("boundary: no cost 3+ card in pitch zone → base power 3", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhimGrandfatherOfEternity,
        weapon1: [titanSFist],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      manual,
    );

    game.as(oldhimGrandfatherOfEternity).activate(titanSFist);
    game.passBoth();

    // resourcePoints seeded directly — no card in pitch zone → no +1P.
    expect(game.combat()?.activeLink?.attackPower).toBe(3);
  });

  // ── Timing / interaction ───────────────────────────────────────────────────

  it("timing: once per turn — second activation is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhimGrandfatherOfEternity,
        weapon1: [titanSFist],
        resourcePoints: 6,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      manual,
    );
    const Oldhim = game.as(oldhimGrandfatherOfEternity);

    Oldhim.activate(titanSFist);
    game.helpers.resolveRestOfCombat();

    Oldhim.expectActivationRejected(titanSFist);
  });
});
