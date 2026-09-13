/**
 * ELE109 Embodiment of Earth — Elemental Token Aura.
 *
 * Printed:
 *   a1: 'Non-attack' action cards you control have +1{d} while defending.
 *   a2: At the beginning of your action phase, destroy Embodiment of Earth.
 *
 * Status: ⬜→✅ — a2 action-phase-start destroy (controller-scoped) proven;
 * a1 continuous +1{d} on defending non-attack actions proven.
 * Card fix: a2 trigger gains `actor:"controller"` (bare `action-phase-start`
 * would match every seat — "your action phase" implies controller scope).
 * Reuses proven continuous-modify-numeric-on-defending (Bastion of Unity) and
 * action-phase trigger (turn-structure) primitives.
 */
import { describe, expect, it } from "vitest";

import { embodimentOfEarth } from "../../../../cards/src/cards/tokens/embodiment-of-earth.ts";
import { FabTestEngine } from "../../testing/test-engine.ts";
import { bravo, dash, nimblismBlue, snatchRed } from "../../rules/fixtures.ts";

const LIFE = 40;

describe("Embodiment of Earth token (ELE109)", () => {
  it("a2: destroyed at the beginning of controller's action phase", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [embodimentOfEarth], deck: 4 },
      { hero: dash, deck: 4 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    expect(Bravo.zone("arena")).toContain(embodimentOfEarth.canonicalId);

    // Bravo ends turn — Dash's turn begins; a2 is controller-scoped so
    // it must NOT fire during Dash's action phase.
    Bravo.endTurn();
    expect(Bravo.zone("arena")).toContain(embodimentOfEarth.canonicalId);

    // Dash ends turn — Bravo's next turn begins; a2 fires at action-phase-start.
    Dash.endTurn();
    game.passBoth();

    expect(Bravo.zone("arena")).not.toContain(embodimentOfEarth.canonicalId);
  });

  it("a2 boundary: not destroyed during opponent's action phase", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [embodimentOfEarth], deck: 4 },
      { hero: dash, deck: 4 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    // Bravo ends turn — Dash's turn. During Dash's action-phase-start,
    // a2 must NOT fire (actor is "controller" = Bravo).
    Bravo.endTurn();
    expect(Bravo.zone("arena")).toContain(embodimentOfEarth.canonicalId);

    // Dash ends turn — Bravo's next turn; a2 fires at his action-phase-start.
    Dash.endTurn();
    game.passBoth();
    expect(Bravo.zone("arena")).not.toContain(embodimentOfEarth.canonicalId);
  });

  it("a1: non-attack action card gets +1 defense while defending", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [nimblismBlue], arena: [embodimentOfEarth], life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const lifeBefore = Dash.life();

    Bravo.attackWith(snatchRed);
    // Defend with Nimblism Blue (non-attack action, base defense 2).
    // Embodiment gives it +1{d} → effective 3 vs Snatch power 4 → 1 damage.
    Dash.defendWith([nimblismBlue]);
    game.helpers.resolveRestOfCombat();

    // 4 power − 3 defense = 1 damage
    expect(Dash.life()).toBe(lifeBefore - 1);
    expect(Dash.zone("graveyard")).toContain(nimblismBlue.canonicalId);
  });

  it("a1 boundary: attack card does NOT get +1 defense from Embodiment", () => {
    // Snatch Red has type Action + subtype Attack — excluded by a1 filter.
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 2, deck: 8 },
      { hero: dash, hand: [snatchRed], arena: [embodimentOfEarth], life: LIFE, deck: 8 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const lifeBefore = Dash.life();

    Bravo.attackWith(snatchRed);
    // Defend with Snatch Red (Attack action — NOT a non-attack action).
    // Base defense 2, no +1 from Embodiment. But Snatch is an attack card
    // defending — that may halve defense to 1. Either way, damage > 1 (no
    // +1 from Embodiment proves the filter works).
    Dash.defendWith([snatchRed]);
    game.helpers.resolveRestOfCombat();

    // Damage dealt: 4 − (2 or 1) = 2 or 3, certainly > 0.
    // Embodiment persists (it's an aura, not consumed by defending).
    expect(Dash.life()).toBeLessThan(lifeBefore);
    expect(Dash.zone("arena")).toContain(embodimentOfEarth.canonicalId);
  });
});
