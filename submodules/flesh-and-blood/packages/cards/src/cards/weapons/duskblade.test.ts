import { describe, expect, it } from "vitest";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../heroes/briar.ts";
import { duskblade } from "./duskblade.ts";
import { electrifyRed as electrify } from "../actions/electrify.ts";
import { snatchRed } from "../actions/snatch.ts";

/**
 * Weapon behavior acceptance test — Duskblade (ELE223).
 *
 * AAA trio:
 * - Happy: 1{r} attack with base power 2
 * - Boundary: trigger adds +1{p} counter when attack+non-attack condition met
 * - Timing: once per turn
 *
 * Trigger (ELE223-a2): "Whenever you attack with Duskblade, if you've played
 * an attack action card and a 'non-attack' action card this turn, put a +1{p}
 * counter on Duskblade."
 *
 * Cleanup (ELE223-a3): End-phase removal of all +1{p} counters if condition
 * NOT met — deferred (requires multi-turn setup).
 *
 * Hero: Briar (ELE063) — Elemental/Runeblade/Young
 * FLUENT API ONLY.
 */

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

describe("Duskblade (ELE223) AAA", () => {
  // ── Happy path ────────────────────────────────────────────────────────────

  it("happy: activate costs 1 resource, opens combat with power 2", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        weapon1: [duskblade],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      manual,
    );

    game.as(briar).activate(duskblade);
    game.passBoth();

    expect(game.combat()?.open).toBe(true);
    expect(game.combat()?.activeLink?.attackPower).toBe(2);
  });

  // ── Trigger: +1{p} counter on attack+non-attack condition ──────────────────

  it("happy: trigger adds +1{p} counter when condition met (power → 3)", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        weapon1: [duskblade],
        hand: [electrify, snatchRed],
        resourcePoints: 5,
        actionPoints: 3,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      // Default config — autoPassPriority/autoPitch handle play-card
      // finalization, ensuring "play" events emit and counters increment.
    );
    const Briar = game.as(briar);

    // Play electrify (non-attack Action) — increments nonAttackActionsPlayed.
    Briar.must.play(electrify);

    // Play snatchRed (Attack Action) — increments attackActionsPlayed.
    // must.playAttack dispatches begin-play, which opens combat in the
    // "layer" step. resolveUntilIdle advances through defend/damage/close,
    // auto-answering the ordering decision with "listed" opt-in.
    Briar.must.playAttack(snatchRed);
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    // Activate Duskblade — trigger condition met, +1{p} counter added.
    Briar.activate(duskblade);

    // Power is 2 base + 1 from counter = 3.
    expect(game.combat()?.activeLink?.attackPower).toBe(3);
  });

  // ── Boundary ───────────────────────────────────────────────────────────────

  it("boundary: no counter without attack+non-attack condition", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        weapon1: [duskblade],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      manual,
    );

    game.as(briar).activate(duskblade);
    game.passBoth();

    // No condition met — base power 2, no counter.
    expect(game.combat()?.activeLink?.attackPower).toBe(2);
  });

  // ── Timing / interaction ───────────────────────────────────────────────────

  it("timing: once per turn — second activation is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        weapon1: [duskblade],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      manual,
    );
    const Briar = game.as(briar);

    Briar.activate(duskblade);
    game.helpers.resolveRestOfCombat();

    Briar.expectActivationRejected(duskblade);
  });
});
