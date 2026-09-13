/**
 * LEV003 Ravenous Meataxe — Brute Axe 2H — power 3.
 *
 * Printed:
 *   a1: Once per Turn Action - {r}{r}: Attack
 *   a2: Whenever you attack with Ravenous Meataxe, draw a card then discard
 *       a random card. If a card with 6 or more {p} is discarded this way,
 *       Ravenous Meataxe gains +2{p} until end of turn.
 *
 * Status: 🟡→✅ — a1 proven @ weapon-equip-arcane-brute; a2 proven here:
 * draw→random-discard runs on every attack, and discarding a 6+ power card
 * this way grants +2{p} (3→5 damage); a sub-6 discard grants nothing (3).
 * Card fix: a2 conditional `has-status discarded-this-way-card-with-6-or-more-p`
 * (never stamped by any reducer) → `binding-matches` on the discard
 * outputBinding "it" with power gte 6 — the PEN002 buzzard-helm proven
 * sibling pattern; the discard proposal already stamps outputBinding "it".
 * Resolves §7 OPEN row `discarded-this-way 6+ power status`.
 *
 * Determinism: the discard uses the typed random-selection policy, so the 6+ path
 * seeds the ENTIRE hand + filler deck with 6+ power cards — whichever card
 * is randomly discarded is guaranteed to have 6+ power. The sub-6 path seeds
 * all hand cards sub-6 with a power-less filler deck.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { dash } from "../../../fixtures.ts";
import { rhinar } from "../../../../../../cards/src/cards/heroes/rhinar.ts";

import { ravenousMeataxe } from "../../../../../../cards/src/cards/weapons/ravenous-meataxe.ts";
import { writhingBeastHulkRed } from "../../../../../../cards/src/cards/actions/writhing-beast-hulk.ts";
import { alphaRampageRed } from "../../../../../../cards/src/cards/actions/alpha-rampage.ts";
import { heartOfFyendalBlue } from "../../../../../../cards/src/cards/resources/heart-of-fyendal.ts";
import { crackedBaubleYellow } from "../../../../../../cards/src/cards/resources/cracked-bauble.ts";

const STARTING_LIFE = 40;

describe("ravenous-meataxe (LEV003)", () => {
  it("a2 happy: discarding a 6+ power card this way grants +2{p} (3 → 5 damage)", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        weapon1: [ravenousMeataxe],
        // Every hand card is 6+ power, and the filler deck is the same 6+
        // card — so the random discard always hits a 6+ power card.
        hand: [writhingBeastHulkRed, alphaRampageRed],
        resourcePoints: 2,
        actionPoints: 1,
        // Deck is also all 6+ power so the draw can't dilute the hand with
        // a sub-6 card — the random discard is guaranteed 6+.
        deck: [
          writhingBeastHulkRed,
          writhingBeastHulkRed,
          writhingBeastHulkRed,
          writhingBeastHulkRed,
          writhingBeastHulkRed,
          writhingBeastHulkRed,
        ],
      },
      { hero: dash, life: STARTING_LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Rhinar = game.as(rhinar);
    const lifeBefore = game.as(dash).life();

    Rhinar.activate(ravenousMeataxe);
    game.helpers.resolveRestOfCombat();

    // Draw 1 + discard 1 net zero hand size; attack hits at 3 + 2 = 5.
    expect(game.as(dash).life()).toBe(lifeBefore - 5);
  });

  it("a2 boundary: discarding a sub-6 power card grants no bonus (3 damage)", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        weapon1: [ravenousMeataxe],
        // Sub-6 hand + power-less filler deck → the random discard is always
        // a sub-6 card, so the +2{p} never applies.
        hand: [heartOfFyendalBlue, crackedBaubleYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 10,
      },
      { hero: dash, life: STARTING_LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Rhinar = game.as(rhinar);
    const lifeBefore = game.as(dash).life();

    Rhinar.activate(ravenousMeataxe);
    game.helpers.resolveRestOfCombat();

    expect(game.as(dash).life()).toBe(lifeBefore - 3);
  });

  it("a1 boundary: once per turn — second activation in the same turn is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        weapon1: [ravenousMeataxe],
        hand: [heartOfFyendalBlue],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 8,
      },
      { hero: dash, life: STARTING_LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Rhinar = game.as(rhinar);

    Rhinar.activate(ravenousMeataxe);
    game.helpers.resolveRestOfCombat();
    expect(() => Rhinar.activate(ravenousMeataxe)).toThrow();
  });
});
