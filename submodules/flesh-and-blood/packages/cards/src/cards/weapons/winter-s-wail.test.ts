import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { oldhimGrandfatherOfEternity } from "../heroes/oldhim-grandfather-of-eternity.ts";
import { winterSWail } from "./winter-s-wail.ts";

/**
 * Weapon behavior acceptance test — Winter's Wail (ELE003).
 *
 * AAA trio:
 * - Happy: 3{r} attack with base power 4
 * - Boundary: base power is 4 with no modifiers
 * - Timing: once per turn
 *
 * Deferred: Ice-pitch conditional (frostbite-on-hit). Requires pitching an
 * Ice card to pay for the attack, setting "pitched-this-way-ice-card" status.
 * Engine gap: frostbite token creation not yet implemented (see ELE032 lexi
 * Ice flip test).
 *
 * Hero: Oldhim Grandfather of Eternity (ELE001) — Elemental/Guardian
 * FLUENT API ONLY.
 */

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

describe("Winter's Wail (ELE003) AAA", () => {
  // ── Happy path ────────────────────────────────────────────────────────────

  it("happy: activate costs 3 resources, opens combat with power 4", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhimGrandfatherOfEternity,
        weapon1: [winterSWail],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      manual,
    );

    game.as(oldhimGrandfatherOfEternity).activate(winterSWail);
    game.passBoth();

    expect(game.combat()?.open).toBe(true);
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
  });

  it("happy: hit deals 4 damage to opposing hero", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhimGrandfatherOfEternity,
        weapon1: [winterSWail],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      manual,
    );

    game.as(oldhimGrandfatherOfEternity).activate(winterSWail);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(16); // 20 − 4
  });

  // ── Boundary ───────────────────────────────────────────────────────────────

  it("boundary: base power is 4 with no modifiers", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhimGrandfatherOfEternity,
        weapon1: [winterSWail],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      manual,
    );

    game.as(oldhimGrandfatherOfEternity).activate(winterSWail);
    game.passBoth();

    expect(game.combat()?.activeLink?.attackPower).toBe(4);
  });

  // ── Timing / interaction ───────────────────────────────────────────────────

  it("timing: once per turn — second activation is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhimGrandfatherOfEternity,
        weapon1: [winterSWail],
        resourcePoints: 6,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      manual,
    );
    const Oldhim = game.as(oldhimGrandfatherOfEternity);

    Oldhim.activate(winterSWail);
    game.helpers.resolveRestOfCombat();

    Oldhim.expectActivationRejected(winterSWail);
  });
});
