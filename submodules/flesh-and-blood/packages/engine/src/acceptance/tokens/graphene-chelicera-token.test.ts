/**
 * HNT053 Graphene Chelicera — Assassin Token Weapon Dagger (1H).
 *
 * Printed:
 *   Power: 1
 *   Keywords: Stealth, Go Again
 *   a1: Once per Turn Action - {r}: Attack
 *
 * Status: ⬜→⬜ — card loads in arena as weapon; activation path verified.
 */
import { describe, expect, it } from "vitest";

import { grapheneChelicera } from "../../../../cards/src/cards/weapons/graphene-chelicera.ts";
import { FabTestEngine } from "../../testing/test-engine.ts";
import { bravo, dash } from "../../rules/fixtures.ts";

const LIFE = 40;

describe("Graphene Chelicera token (HNT053)", () => {
  it("card loads in arena as a weapon token", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [grapheneChelicera], deck: 8 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    expect(Bravo.zone("arena")).toContain(grapheneChelicera.canonicalId);
  });

  it("AAA: activates weapon attack, deals 1 damage", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [grapheneChelicera],
        deck: 6,
        actionPoints: 1,
        resourcePoints: 1,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const lifeBefore = Dash.life();

    Bravo.activate(grapheneChelicera);
    game.passBoth(); // activation layer
    game.helpers.resolveRestOfCombat();

    // Power 1 → 1 damage.
    expect(Dash.life()).toBe(lifeBefore - 1);
    // Go again from the keyword should be on the attack link.
  });

  it.each([false, true])(
    "Stealth has no intrinsic bonus; marked=%s controls the printed go-again trigger",
    (marked) => {
      const game = FabTestEngine.start(
        {
          hero: bravo,
          arena: [grapheneChelicera],
          resourcePoints: 1,
          actionPoints: 1,
          deck: 6,
        },
        { hero: dash, life: LIFE, marked, deck: 6 },
        { autoPassPriority: false },
      );
      const Bravo = game.as(bravo);
      const Dash = game.as(dash);

      Bravo.activate(grapheneChelicera);
      game.helpers.resolveRestOfCombat();

      expect(Dash.life()).toBe(LIFE - 1);
      expect(Bravo.actionPoints()).toBe(marked ? 1 : 0);
    },
  );
});
