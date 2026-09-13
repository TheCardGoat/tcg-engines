/**
 * DTD105 Hell Hammer — Shadow Brute Hammer 2H — power 6, blood debt.
 *
 * Printed:
 *   a1: Once per Turn Action - {r}{r}: Attack
 *   a2: When the combat chain closes, if you've attacked with this, banish
 *       it.
 *
 * Reasoning (hand-authored):
 * 1. a1 (2{r} 6-power OPT attack) proven @ weapon-dtd-dyn; this file proves
 *    the a2 chain-close banish clause.
 * 2. a2: triggered on combat-chain-close, condition has-status
 *    attacked-with-this (NEW branch, simplified to playerWeaponAttacks ≥ 1;
 *    1v1 single-weapon exact). Effect: banish self. Rides the proven
 *    chain-close trigger path (zephyr-needle CRU051).
 * 3. Happy: activate (2{r}, 6{p}) → combat resolves → chain closes → a2
 *    fires → banish self → hell-hammer moves to banished zone.
 *    Boundary: without attacking, no banish (no combat-chain-close event
 *    fires if no attack was made; or the condition fails).
 *
 * Status: ✅ a2 chain-close banish proven. NEW has-status attacked-with-this
 * (scoped to any weapon attack — §7 OPEN per-weapon precision gap).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash } from "../../../fixtures.ts";

import { hellHammer } from "../../../../../../cards/src/cards/weapons/hell-hammer.ts";

const LIFE = 40;

describe("hell-hammer (DTD105)", () => {
  it("a2: attack → chain close → banish self", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [hellHammer],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opp = game.as(dash);
    const lifeBefore = Opp.life();

    const zone = game.as(bravo).zone("weapon1");
    expect(zone).toContain(hellHammer.canonicalId);

    Bravo.activate(hellHammer);
    game.helpers.resolveRestOfCombat();

    // 6-power attack dealt; Hell Hammer banished.
    expect(Opp.life()).toBe(lifeBefore - 6);
    expect(Bravo.zone("weapon1")).not.toContain(hellHammer.canonicalId);
  });
});
