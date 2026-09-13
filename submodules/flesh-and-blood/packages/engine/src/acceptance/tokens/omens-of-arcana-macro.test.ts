/**
 * Source packet — OMN227-a1/a2 (Omens of Arcana):
 *
 * Printed promise: "Each hero starts the game with a Lightning Flow token."
 * Plus OMN227-a2: Lightning Flow tokens get spellvoid 1.
 * CR: 1.5.1–1.5.3, 4.1.1.
 */
import { describe, expect, it } from "vitest";

import { omensOfArcana } from "../../../../cards/src/cards/macros/omens-of-arcana.ts";
import { lightningFlow } from "../../../../cards/src/cards/tokens/lightning-flow.ts";
import { runechant } from "../../../../cards/src/cards/tokens/runechant.ts";
import { FabTestEngine } from "../../testing/test-engine.ts";
import { bravo, dash, dawnblade } from "../../rules/fixtures.ts";

describe("Omens of Arcana macro (OMN227)", () => {
  it("a1 AAA: each hero starts with a Lightning Flow token (meta execution)", () => {
    // Fixture initialization creates 1 Lightning Flow through the hero's meta ability.
    // token per player from the `controller: "each"` create-token effect.
    const game = FabTestEngine.start(
      { hero: bravo, macros: [omensOfArcana], deck: 4 },
      { hero: dash, macros: [omensOfArcana], deck: 4 },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    // Each hero has exactly 1 Lightning Flow token from meta execution
    const bravoTokens = Bravo.findCardsInZone("arena", [lightningFlow]);
    const dashTokens = Dash.findCardsInZone("arena", [lightningFlow]);
    expect(bravoTokens).toHaveLength(1);
    expect(dashTokens).toHaveLength(1);
  });

  it("a2 AAA: Lightning Flow spellvoid 1 prevents arcane damage to its controller", () => {
    // Dash (player1) has Runechant + Dawnblade. Bravo (player2) has Omens of
    // Arcana which grants spellvoid(1) to all Lightning Flow tokens.
    // When Dash attacks, Runechant deals 1 arcane damage to Bravo.
    // Bravo's Lightning Flow spellvoid(1) should prevent that damage.
    const game = FabTestEngine.start(
      {
        hero: dash,
        weapon1: [dawnblade],
        arena: [runechant],
        deck: 4,
        actionPoints: 1,
        resourcePoints: 1,
      },
      { hero: bravo, macros: [omensOfArcana], deck: 4 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const lifeBefore = Bravo.life();

    // Verify Lightning Flow is in Bravo's arena (meta execution)
    expect(Bravo.zone("arena")).toContain(lightningFlow.canonicalId);

    // Dash attacks → Runechant deals 1 arcane to Bravo
    // → Bravo's Lightning Flow spellvoid(1) prevents it → life unchanged
    Dash.activate(dawnblade);
    game.passBoth();

    expect(Bravo.life()).toBe(lifeBefore);
  });
});
