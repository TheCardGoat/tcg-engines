/**
 * CRU051 Zephyr Needle — Ninja Dagger 1H — power 2.
 *
 * Printed:
 *   a1: Once per Turn Action - {r}: Attack. Go again
 *   a2: When this is defended by a card with {d} greater than this weapon
 *       attack's {p}, destroy this when the combat chain closes.
 *
 * Reasoning (hand-authored):
 * 1. a1 (2-power go-again dagger) already proven @ weapon-equipment-next;
 *    this file proves the a2 destroy clause through public moves.
 * 2. a2 rides three proven paths: the `defense-greater-than-attack-power`
 *    has-status matcher (FIXED in §7 2026-08-07 — Zephyr Needle's own row),
 *    the defend declaration flow, and the delayed combat-chain-close destroy
 *    (ironhide MON241/242 family — CIN002 kunai rides the same path).
 * 3. Happy: defended by d7 (Unmovable) > p2 → dagger destroyed when the
 *    chain closes. Boundary: defended by d2 (Nimblism, not greater) →
 *    dagger survives. No-defend → hit, dagger survives.
 *
 * Status: ✅ a2 destroy-on-greater-defense proven; d2-equal survives; no-defend
 * survives (a1 @ weapon-equipment-next).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, rattleBonesRed, nimblismBlue } from "../../../fixtures.ts";

import { zephyrNeedle } from "../../../../../../cards/src/cards/weapons/zephyr-needle.ts";

const LIFE = 40;

describe("zephyr-needle (CRU051)", () => {
  it("a2: defended by a card with {d} > {p} → destroyed when the combat chain closes", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [zephyrNeedle],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, hand: [rattleBonesRed], deck: 6 },
      // Default autoPassPriority: true — the engine stops at the defend
      // step so the defender can declare blocks (weapon-pilots pattern).
      // Rattle Bones is a non-DR action card with d3 (CR 7.3.2a: DR cards
      // cannot be DECLARED as defenders — they defend only when played in
      // the Reaction Step).
    );
    const Bravo = game.as(bravo);
    const Opp = game.as(dash);
    const lifeBefore = Opp.life();

    Bravo.activate(zephyrNeedle);
    expect(game.combat()?.step).toBe("defend");
    // Rattle Bones is defense 3 — greater than the attack's 2{p}.
    Opp.defendWith(rattleBonesRed);
    game.helpers.resolveRestOfCombat();

    // Fully blocked (d3 ≥ 2) and the dagger was destroyed at chain close.
    expect(Opp.life()).toBe(lifeBefore);
    expect(Bravo.zone("weapon1")).not.toContain(zephyrNeedle.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(zephyrNeedle.canonicalId);
  });

  it("boundary: defended by {d} equal to {p} (d2) → dagger survives", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [zephyrNeedle],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, hand: [nimblismBlue], deck: 6 },
      // Default autoPassPriority: true — stops at the defend step.
    );
    const Bravo = game.as(bravo);
    const Opp = game.as(dash);
    const lifeBefore = Opp.life();

    Bravo.activate(zephyrNeedle);
    expect(game.combat()?.step).toBe("defend");
    // Nimblism is defense 2 — NOT greater than the attack's 2{p}.
    Opp.defendWith(nimblismBlue);
    game.helpers.resolveRestOfCombat();

    expect(Opp.life()).toBe(lifeBefore);
    expect(Bravo.zone("weapon1")).toContain(zephyrNeedle.canonicalId);
    expect(Bravo.zone("graveyard")).not.toContain(zephyrNeedle.canonicalId);
  });

  it("boundary: no defend → hits, dagger survives", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [zephyrNeedle],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, hand: [], deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opp = game.as(dash);
    const lifeBefore = Opp.life();

    Bravo.activate(zephyrNeedle);
    game.helpers.resolveRestOfCombat();

    expect(Opp.life()).toBe(lifeBefore - 2);
    expect(Bravo.zone("weapon1")).toContain(zephyrNeedle.canonicalId);
  });
});
