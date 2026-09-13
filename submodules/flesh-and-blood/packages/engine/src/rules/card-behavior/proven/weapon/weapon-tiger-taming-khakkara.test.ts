/**
 * MST159 Tiger Taming Khakkara — Ninja Staff 2H — power 2.
 *
 * Printed:
 *   a1: Once per Turn Action - {r}{r}: Attack. Go again
 *   a2: When this attacks, the next Crouching Tiger you play this combat
 *       chain gets +1{p}.
 *
 * Reasoning (hand-authored):
 * 1. a1 (2{r} 2{p} go-again OPT attack) proven @ weapon-opt-attack-wave2;
 *    this file proves the a2 Crouching Tiger buff.
 * 2. CARD FIX (this cycle): the attack trigger gained `subject: "self"` so
 *    "When THIS attacks" fires only on the weapon's own attack events (the
 *    attack object IS the weapon for weapon attacks; attack-action plays by
 *    the controller are excluded). The name filter for the aura ("Crouching
 *    Tiger") was already corrected in an earlier pass.
 * 3. Happy: Khakkara attacks → play Crouching Tiger (DYN065, 0-cost 0{p}
 *    Ninja attack, go again) → a2 +1{p} → 1 damage + AP refund.
 *    Boundary: a non-CT attack (Snatch) gets no buff.
 *
 * Status: ✅ a2 next-Crouching-Tiger +1{p} proven; non-CT attack unaffected
 * (a1 @ weapon-opt-attack-wave2).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";

import { tigerTamingKhakkara } from "../../../../../../cards/src/cards/weapons/tiger-taming-khakkara.ts";
import { crouchingTiger } from "../../../../../../cards/src/cards/actions/crouching-tiger.ts";

const LIFE = 40;

describe("tiger-taming-khakkara (MST159)", () => {
  it("a2: attack → next Crouching Tiger gets +1{p} (0+1 = 1)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [tigerTamingKhakkara],
        hand: [crouchingTiger],
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

    // Attack 1: Khakkara (2{p}) hits undefended → 2 damage, a2 armed.
    Bravo.activate(tigerTamingKhakkara);
    // The next Crouching Tiger must be played before this combat chain closes.
    game.advanceCombatTo("resolution");
    expect(Opp.life()).toBe(lifeBefore - 2);
    expect(Bravo.actionPoints()).toBe(1); // go again refund

    // Attack 2: Crouching Tiger (0{p}) → a2: 0+1 = 1 damage, go again.
    Bravo.attackWith(crouchingTiger);
    game.advanceCombatTo("resolution");
    expect(Opp.life()).toBe(lifeBefore - 3);
  });

  it("a2 boundary: a non-Crouching-Tiger attack gets no buff", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [tigerTamingKhakkara],
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

    Bravo.activate(tigerTamingKhakkara);
    game.helpers.resolveRestOfCombat();

    // Snatch (4{p}) is not named Crouching Tiger → full 4, no +1.
    Bravo.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expect(Opp.life()).toBe(lifeBefore - 6); // 2 + 4
  });
});
