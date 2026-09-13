/**
 * MON121 Hexagore, the Death Hydra — Shadow Brute Flail 2H — power 6.
 *
 * Printed:
 *   a1: Once per Turn Action - {r}{r}: Attack
 *   a2: Whenever you attack with Hexagore, it deals damage to you equal to
 *       6 minus the number of cards with blood debt in your banished zone.
 *
 * Status: 🟡→✅ — a1 proven @ weapon-opt-attack-wave2; a2 proven here:
 * attacking deals self-damage 6 − (blood-debt cards in banished): 0 banished
 * → 6 self-damage; 2 seeded blood-debt banished → 4 self-damage; the attack
 * still hits the opponent for 6 in all cases; OPT boundary.
 * Rides proven `difference` + `cards-in-zone`(hasKeyword blood-debt) amount
 * primitives (evaluate-amount.ts) and the self-damage deal-damage path
 * (DTD135 flail-of-agony family).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { dash } from "../../../fixtures.ts";
import { rhinar } from "../../../../../../cards/src/cards/heroes/rhinar.ts";

import { hexagoreTheDeathHydra } from "../../../../../../cards/src/cards/weapons/hexagore-the-death-hydra.ts";
import { seedsOfAgonyRed } from "../../../../../../cards/src/cards/actions/seeds-of-agony.ts";

const LIFE = 40;

describe("hexagore-the-death-hydra (MON121)", () => {
  it("a2: no blood-debt banished → 6 self-damage, opponent still hit for 6", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        weapon1: [hexagoreTheDeathHydra],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Rhinar = game.as(rhinar);
    const Opp = game.as(dash);
    const rhinarLifeBefore = Rhinar.life();
    const oppLifeBefore = Opp.life();

    Rhinar.activate(hexagoreTheDeathHydra);
    game.helpers.resolveRestOfCombat();

    // 6 − 0 = 6 self-damage; the 6-power attack hits the opponent undefended.
    expect(Rhinar.life()).toBe(rhinarLifeBefore - 6);
    expect(Opp.life()).toBe(oppLifeBefore - 6);
  });

  it("a2: 2 blood-debt cards in banished → 4 self-damage, opponent still hit for 6", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        weapon1: [hexagoreTheDeathHydra],
        hand: [],
        banished: [seedsOfAgonyRed, seedsOfAgonyRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Rhinar = game.as(rhinar);
    const Opp = game.as(dash);
    const rhinarLifeBefore = Rhinar.life();
    const oppLifeBefore = Opp.life();

    Rhinar.activate(hexagoreTheDeathHydra);
    game.helpers.resolveRestOfCombat();

    // 6 − 2 = 4 self-damage; the attack still deals 6 to the opponent.
    expect(Rhinar.life()).toBe(rhinarLifeBefore - 4);
    expect(Opp.life()).toBe(oppLifeBefore - 6);
  });

  it("a1 boundary: once per turn — second activation in the same turn is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        weapon1: [hexagoreTheDeathHydra],
        hand: [],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Rhinar = game.as(rhinar);

    Rhinar.activate(hexagoreTheDeathHydra);
    game.helpers.resolveRestOfCombat();
    expect(() => Rhinar.activate(hexagoreTheDeathHydra)).toThrow();
  });
});
