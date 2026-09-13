/**
 * CRU024 Sledge of Anvilheim — Guardian Hammer 2H — power 6.
 *
 * Printed (catalog i18n, CRU024-sledge-of-anvilheim.i18n.ts):
 *   a1: Action - {r}{r}{r}{r}: Attack
 *
 * NOTE (doc correction): the previous §5 coverage note claimed a "block
 * reduction" clause ("remaining clause it.todo"). The catalog oracle text
 * for CRU024 is ONLY the 4{r} attack — there is no block-reduction clause,
 * so the card is Ab=1 with a single printed ability (a plain 4-cost 6-power
 * attack with NO once-per-turn limit).
 *
 * Reasoning (hand-authored):
 * 1. Ab=1: the attack IS the printed ability — prove activation (4{r} →
 *    6 damage), the resource boundary (3{r} illegal), and the absence of
 *    any once-per-turn limit (second activation with 8{r} legal).
 * 2. Guardian Hammer 2H — no go again, no OPT, no tap.
 *
 * Status: ✅ attack activation + RP boundary + no-OPT proven; §5 note
 * corrected to match the catalog oracle text.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash } from "../../../fixtures.ts";

import { sledgeOfAnvilheim } from "../../../../../../cards/src/cards/weapons/sledge-of-anvilheim.ts";

const LIFE = 40;

describe("sledge-of-anvilheim (CRU024)", () => {
  it("a1: 4{r} → 6-power attack (full damage undefended)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [sledgeOfAnvilheim],
        hand: [],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opp = game.as(dash);
    const lifeBefore = Opp.life();

    Bravo.activate(sledgeOfAnvilheim);
    game.helpers.resolveRestOfCombat();

    expect(Opp.life()).toBe(lifeBefore - 6);
  });

  it("a1 boundary: 3{r} is insufficient → activation illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [sledgeOfAnvilheim],
        hand: [],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
    );
    const Bravo = game.as(bravo);

    expect(() => Bravo.activate(sledgeOfAnvilheim)).toThrow();
    expect(game.combat()).toBeNull();
  });

  it("a1: no once-per-turn limit — second activation with 8{r} legal", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [sledgeOfAnvilheim],
        hand: [],
        resourcePoints: 8,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opp = game.as(dash);
    const lifeBefore = Opp.life();

    Bravo.activate(sledgeOfAnvilheim);
    game.helpers.resolveRestOfCombat();
    expect(Opp.life()).toBe(lifeBefore - 6);

    // No OPT on the printed text → a second 4{r} activation is legal.
    Bravo.activate(sledgeOfAnvilheim);
    game.helpers.resolveRestOfCombat();
    expect(Opp.life()).toBe(lifeBefore - 12);
  });
});
