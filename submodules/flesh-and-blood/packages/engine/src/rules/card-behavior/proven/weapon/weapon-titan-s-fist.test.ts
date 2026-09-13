/**
 * ELE202 Titan's Fist — Guardian Hammer 1H — power 3.
 *
 * Printed:
 *   a1: Once per Turn Action - {r}{r}{r}: Attack
 *   a2: If there is a card with cost 3 or greater in your pitch zone,
 *       Titan's Fist has +1{p}.
 *
 * Reasoning (hand-authored):
 * 1. a1: 3{r} weapon attack at base 3; OPT + RP boundaries.
 * 2. a2: continuous static gated on zone-count pitch cost ≥ 3 — the exact
 *    proven shape of BVO003 anothos a2 (cost-3+ cards in pitch → +{p}),
 *    which uses numeric base-cost filters. Pitch one cost-3 card (Unmovable,
 *    cost 3) → 3+1 = 4 damage; low-cost pitch (Nimblism, cost 0) → base 3.
 *
 * Status: ✅ a1 3RP 3-power attack + OPT/RP; a2 +1{p} while a cost-3+ card
 * sits in the pitch zone (happy + low-cost boundary).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, unmovableRed, nimblismBlue } from "../../../fixtures.ts";

import { titanSFist } from "../../../../../../cards/src/cards/weapons/titan-s-fist.ts";

const LIFE = 40;

describe("titan-s-fist (ELE202)", () => {
  it("core: pay 3 RP for a 3-power weapon attack", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [titanSFist],
        hand: [],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opp = game.as(dash);
    const lifeBefore = Opp.life();

    Bravo.activate(titanSFist);
    game.helpers.resolveRestOfCombat();

    expect(Opp.life()).toBe(lifeBefore - 3);
    expect(Bravo.resourcePoints()).toBe(0);
  });

  it("a2: +1{p} while a cost-3+ card sits in the pitch zone", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [titanSFist],
        // Unmovable is cost 3 — satisfies the cost-3+ pitch gate.
        pitch: [unmovableRed],
        hand: [],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opp = game.as(dash);
    const lifeBefore = Opp.life();

    expect(Bravo.zone("pitch")).toContain(unmovableRed.canonicalId);

    Bravo.activate(titanSFist);
    game.helpers.resolveRestOfCombat();

    // Base 3 + a2's +1 = 4 damage.
    expect(Opp.life()).toBe(lifeBefore - 4);
  });

  it("a2 boundary: low-cost pitch (cost 0) leaves the attack at base 3", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [titanSFist],
        pitch: [nimblismBlue],
        hand: [],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opp = game.as(dash);
    const lifeBefore = Opp.life();

    Bravo.activate(titanSFist);
    game.helpers.resolveRestOfCombat();

    expect(Opp.life()).toBe(lifeBefore - 3);
  });

  it("boundaries: once per turn and insufficient resources", () => {
    const opt = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [titanSFist],
        hand: [],
        resourcePoints: 6,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    opt.as(bravo).activate(titanSFist);
    opt.helpers.resolveRestOfCombat();
    expect(() => opt.as(bravo).activate(titanSFist)).toThrow();

    const poor = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [titanSFist],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => poor.as(bravo).activate(titanSFist)).toThrow();
  });
});
