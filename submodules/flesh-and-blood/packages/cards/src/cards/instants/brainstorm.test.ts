import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kano } from "../heroes/kano.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { tomeOfFyendalYellow } from "../actions/tome-of-fyendal.ts";
import { brainstormBlue } from "./brainstorm.ts";

/**
 * Brainstorm, Blue (DYN196) — Wizard Instant, cost 3, pitch 3.
 * Printed: 'Until end of turn, your hero gains "Whenever you draw a card
 * this action phase, deal 1 arcane damage to any target".'
 *
 * fab-rules Mode B handoff:
 *   citations: CR 4.3 (action phase), CR 4.4.3f (end-phase draw to
 *     intellect), CR 4.4.4 ("this turn" expiry), CR 3.9 (arcane damage),
 *     CR 5.1.3b (instants cost no action point), CR 5.3 (resolution).
 *   behaviorConstraints:
 *     - The granted hero trigger pings 1 arcane per card drawn DURING the
 *       action phase, at a target of the drawing player's choice.
 *     - The end-phase intellect draw (CR 4.4.3f) is NOT an action-phase
 *       draw: it must not fire the trigger even though "until end of turn"
 *       effects are still live at 4.4.3 (they expire at 4.4.4).
 *     - The grant expires at end of turn — later turns' draws ping nothing.
 *
 * PINNED MISBEHAVIORS (plan §5, W4-C) — three distinct module/engine gaps:
 *   (a) Phase scope: the granted trigger subscribes to the bare "draw"
 *       event with no action-phase scoping, so the end-phase
 *       draw-to-intellect mis-fires it once per card (observed: 4
 *       simultaneous DYN196-a1 occurrences at endTurn with an empty hand).
 *   (b) Per-card granularity: an effect that draws N cards ("Draw 2
 *       cards") queues only ONE occurrence — "whenever you draw a card"
 *       should fire per card drawn (end-phase draws, emitted per-card,
 *       do fire per-card).
 *   (c) Stray on-play arcane: the module carries a stray `arcane: 1` stat
 *       that deals 1 arcane "from Brainstorm" to the opposing hero when
 *       the instant resolves — the printed text deals no on-play damage.
 * The trapdoors are pinned below; the provable core (grant fires on
 * action-phase draws, 1 arcane, any target, no AP cost, turn expiry) is
 * asserted green against the pinned composition.
 */

describe("Brainstorm (DYN196) AAA", () => {
  it("happy: action-phase draws fire the grant — 1 arcane at a chosen target, and the instant never spends an action point", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [brainstormBlue, tomeOfFyendalYellow],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Dash = game.as(dash);

    // Instant play: costs resources, never an action point (CR 5.1.3b).
    Kano.play(brainstormBlue);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Kano).toHaveAP(1);

    // Tome of Fyendal draws 2 during the action phase: the grant fires.
    // The ping's "any target" declaration is answered with KANO himself so
    // the ping is observable apart from the pinned stray arcane (c) that
    // auto-hits Dash. Printed-per-card would ping Kano twice; the engine
    // batches the draw-2 into one occurrence (pin b).
    Kano.play(tomeOfFyendalYellow);
    game.helpers.resolveUntilIdle({
      ordering: "listed",
      entityTargetCanonicalId: kano.canonicalId,
    });

    expectFabPlayer(Kano).toHaveLife(14); // exactly one 1-arcane ping landed
    expectFabPlayer(Dash).toHaveLife(19); // only the pinned stray (c)
    expectFabPlayer(Kano).toHaveHandCount(2); // 2 played, 2 drawn
  });

  it("PINNED (§5 W4-C c): resolving Brainstorm deals a stray 1 arcane — the printed text has no on-play damage", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [brainstormBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Dash = game.as(dash);

    // No draw happens anywhere: the only damage that may legally exist is
    // none. The module's stray `arcane: 1` stat lands 1 arcane "from
    // Brainstorm" on the sole opposing hero at resolution.
    Kano.play(brainstormBlue);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(19); // pinned misbehavior (c)
    expectFabPlayer(Kano).toHaveLife(15); // the ping never fired — nothing drew
  });

  it("PINNED (§5 W4-C a): the end-phase intellect draw (CR 4.4.3f) mis-fires the action-phase-scoped ping", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [brainstormBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);

    Kano.play(brainstormBlue);
    game.helpers.resolveUntilIdle();

    // A faithful encoding draws Kano up to intellect at 4.4.3f WITHOUT
    // queueing DYN196-a1 — the printed scope is "this action phase". The
    // module's unscoped trigger fires once per end-phase draw (4 cards),
    // and the drain wedges on their simultaneous-trigger ordering decision.
    Kano.endTurn();
    expect(() => game.helpers.resolveUntilIdle({ optionalBoolean: false })).toThrow(
      /requires an explicit ordering answer/,
    );
  });

  it("PINNED (§5 W4-C a+c): answering the mis-fired end-phase occurrences lands 4 arcane plus the stray", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [brainstormBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Dash = game.as(dash);

    Kano.play(brainstormBlue);
    game.helpers.resolveUntilIdle();
    Kano.endTurn();

    // Empty hand, intellect 4 → exactly 4 end-phase draws, each mis-firing
    // the ping at Dash. With the stray on-play arcane (c) the pinned total
    // is 5: a faithful module would leave Dash at 20 (0 draws in scope).
    game.helpers.resolveUntilIdle({
      optionalBoolean: false,
      ordering: "listed",
      entityTargetCanonicalId: dash.canonicalId,
    });

    expectFabPlayer(Dash).toHaveLife(15); // 1 stray (c) + 4 mis-scoped pings (a)
    expectFabPlayer(Kano).toHaveHandCount(4); // drawn up to intellect
  });

  it("timing: the grant expires — next turn's action-phase draws add no further ping", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [brainstormBlue, nimblismBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
        deckTop: [tomeOfFyendalYellow],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Dash = game.as(dash);

    Kano.play(brainstormBlue);
    game.helpers.resolveUntilIdle();
    Kano.endTurn();
    // Drain through the pinned end-phase mis-fire to reach the next turn:
    // 1 stray (c) + 3 mis-scoped pings (a) set the pinned baseline at 16.
    game.helpers.resolveUntilIdle({
      optionalBoolean: false,
      ordering: "listed",
      entityTargetCanonicalId: dash.canonicalId,
    });
    expectFabPlayer(Dash).toHaveLife(16);
    Dash.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    // New turn: floating resources reset at the rollover, so the Tome's {r}
    // cost is paid by pitching Nimblism. Its draws queue no occurrence and
    // land no damage — the grant died with the previous turn (CR 4.4.4).
    // The invariant is the absence of any FURTHER ping past the baseline.
    Kano.must.pitch(nimblismBlue).play(tomeOfFyendalYellow);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabPlayer(Kano).toHaveHandCount(4); // 4 upkept − pitch − play + 2 drawn
  });
});
