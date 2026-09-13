/**
 * MST003 Beckoning Mistblade — Mystic Assassin Dagger 1H — power 1.
 *
 * Printed:
 *   a1: Once per Turn Action - {r}{r}: Attack. Go again
 *   a2: When this hits, your next blue attack this turn gets +1{p} and go
 *       again.
 *
 * Reasoning (hand-authored):
 * 1. a1 (2{r} 1{p} go-again OPT attack) proven @ weapon-opt-attack-wave2;
 *    this file proves the a2 blue-attack buff clause.
 * 2. CARD MODEL FIX: the floating-aura filters used subtypes:["Blue"] —
 *    Blue is a COLOR, not a subtype (wordFilter family, like "Equipment"/
 *    "Weapon" as subtypes). Remodeled to color:["Blue"].
 * 3. Happy: Mistblade hits → play Jittery Bones (AGB022, blue 2{p} attack)
 *    → a2 grants +1{p} AND go again → 3 damage + AP refund.
 *    Boundary: a NON-blue attack (Snatch 4{p}) gets no buff and no go again.
 *
 * Status: ✅ a2 +1{p}+go again on the next blue attack proven; non-blue
 * attack unaffected (a1 @ weapon-opt-attack-wave2).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";

import { beckoningMistblade } from "../../../../../../cards/src/cards/weapons/beckoning-mistblade.ts";
import { jitteryBonesBlue } from "../../../../../../cards/src/cards/actions/jittery-bones.ts";

const LIFE = 40;

describe("beckoning-mistblade (MST003)", () => {
  it("a2: hit → next BLUE attack gets +1{p} and go again (2+1 = 3, AP refund)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [beckoningMistblade],
        hand: [jitteryBonesBlue],
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

    // Attack 1: Mistblade (1{p}) hits undefended → 1 damage, a2 armed.
    Bravo.activate(beckoningMistblade);
    game.helpers.resolveRestOfCombat();
    expect(Opp.life()).toBe(lifeBefore - 1);
    // Go again refunded the activation AP.
    expect(Bravo.actionPoints()).toBe(1);

    // Attack 2: Jittery Bones (blue, 2{p}) → a2: 2+1 = 3 damage + go again.
    Bravo.attackWith(jitteryBonesBlue);
    game.helpers.resolveRestOfCombat();
    expect(Opp.life()).toBe(lifeBefore - 4);
    // The a2-granted go again refunded the attack AP.
    expect(Bravo.actionPoints()).toBe(1);
  });

  it("a2 boundary: a NON-blue attack gets no buff and no go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [beckoningMistblade],
        hand: [snatchRed],
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

    Bravo.activate(beckoningMistblade);
    game.helpers.resolveRestOfCombat();

    // Snatch (red, 4{p}) is outside the color:["Blue"] filter → full 4
    // damage, no go-again refund (AP stays 0 after the attack).
    Bravo.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expect(Opp.life()).toBe(lifeBefore - 5); // 1 + 4
    expect(Bravo.actionPoints()).toBe(0);
  });
});
