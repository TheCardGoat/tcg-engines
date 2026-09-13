/**
 * DYN067 Jubeel, Spellbane — Warrior Sword 2H — power 3.
 *
 * Printed:
 *   a1: Once per Turn Action - {r}: Attack
 *   a2: Whenever this hits a hero and you don't control a Spellbane Aegis,
 *       create a Spellbane Aegis token.
 *
 * Reasoning (hand-authored):
 * 1. a1 (1{r} 3{p} OPT attack) proven @ weapon-dtd-dyn; this file proves the
 *    a2 token-creation clause.
 * 2. a2 rides: the cycle-4 weapon hit-scoping (fires only on this weapon's
 *    own hero hits) + the not(control-object) condition + the create-token
 *    path (token DYN246 spellbane-aegis).
 * 3. Happy: Jubeel hits undefended → a2 creates a Spellbane Aegis token in
 *    the controller's arena. Boundary: with a Spellbane Aegis already
 *    controlled (arena-seeded), a hit creates NO second token.
 *
 * Status: ✅ a2 Spellbane Aegis creation proven; pre-seeded boundary (a1 @
 * weapon-dtd-dyn).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash } from "../../../fixtures.ts";

import { jubeelSpellbane } from "../../../../../../cards/src/cards/weapons/jubeel-spellbane.ts";
import { spellbaneAegis } from "../../../../../../cards/src/cards/tokens/spellbane-aegis.ts";

const LIFE = 40;

function aegisCount(game: ReturnType<typeof FabTestEngine.start>): number {
  // Seeded copies carry the module canonicalId (hash); created tokens get a
  // runtime id "token:spellbane-aegis". Match both shapes.
  const state = game.getState();
  const aid = spellbaneAegis.canonicalId;
  return Object.values(state.objects).filter(
    (o) => o.canonicalId === aid || o.canonicalId === "token:spellbane-aegis",
  ).length;
}

describe("jubeel-spellbane (DYN067)", () => {
  it("a2: hit a hero with no Spellbane Aegis → create the token", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [jubeelSpellbane],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opp = game.as(dash);
    const lifeBefore = Opp.life();

    expect(aegisCount(game)).toBe(0);
    Bravo.activate(jubeelSpellbane);
    game.helpers.resolveRestOfCombat();

    // 3 physical damage + the a2 token in the arena.
    expect(Opp.life()).toBe(lifeBefore - 3);
    expect(aegisCount(game)).toBe(1);
  });

  it("a2 boundary: already controlling a Spellbane Aegis → no second token", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [jubeelSpellbane],
        arena: [spellbaneAegis],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opp = game.as(dash);
    const lifeBefore = Opp.life();

    expect(aegisCount(game)).toBe(1);
    Bravo.activate(jubeelSpellbane);
    game.helpers.resolveRestOfCombat();

    expect(Opp.life()).toBe(lifeBefore - 3);
    expect(aegisCount(game)).toBe(1); // condition blocks the duplicate
  });
});
