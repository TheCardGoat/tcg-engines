import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { briar } from "../heroes/briar.ts";
import { dash } from "../heroes/dash.ts";
import { cosmicFlareRed } from "../instants/cosmic-flare.ts";
import { cracklingRed } from "./crackling.ts";
import { cracklingYellow } from "./crackling.ts";

/**
 * Crackling, Red (AUR007) — Elemental Runeblade Attack Action.
 *
 * Printed: "Lightning Flow - If you've played a Lightning card this turn,
 * this gets +1{p}."
 *
 * fab-rules Mode B handoff:
 *   citations: CR 5.3 (resolution ability generates its effect when the
 *     card-layer resolves), CR 6.2 (layer-continuous modify-numeric on the
 *     chain link), CR 8.1.5 (Lightning Flow — "played a Lightning card this
 *     turn" is the played-this turn status filtered by the Lightning
 *     supertype), CR 2.9 (power).
 *   behaviorConstraints:
 *     - The +1{p} applies only when a Lightning card was played earlier THIS
 *       TURN; without one the attack stays at its printed 3{p}.
 *     - The modifier is part of the attack's on-chain power before the
 *       damage step, so the hit deals 3+1 damage.
 *   testImplications:
 *     - Assert the chain link reads 4{p} after a Lightning card this turn,
 *       3{p} without one, and that the boosted link deals 4 damage.
 */

describe("Crackling (AUR007) AAA", () => {
  it("happy: after a Lightning card this turn, the attack reads 4{p} on the chain", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [cosmicFlareRed, cracklingRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    // Cosmic Flare (cost-0 Lightning instant) is the Lightning card played
    // this turn that enables Lightning Flow.
    Briar.play(cosmicFlareRed);
    game.helpers.resolveUntilIdle();

    Briar.playAttack(cracklingRed);
    game.advanceCombatTo("defend");
    // Printed 3{p} + 1 from Lightning Flow = 4.
    expectCombat(game).toHaveAttackPower(4);
  });

  it("boundary: no Lightning card played this turn — the attack stays at printed 3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [cracklingRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.playAttack(cracklingRed);
    game.advanceCombatTo("defend");
    // No Lightning card this turn: the conditional +1 never applies.
    expectCombat(game).toHaveAttackPower(3);
  });

  it("timing: the +1{p} is on the link before damage — the hit deals 4", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [cosmicFlareRed, cracklingRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.play(cosmicFlareRed);
    game.helpers.resolveUntilIdle();

    Briar.playAttack(cracklingRed);
    expectCombat(game).toHaveAttackPower(4);
    game.helpers.resolveRestOfCombat();

    // 3 base + 1 Lightning Flow damage lands; the attack reaches the
    // graveyard.
    expectFabPlayer(Dash).toHaveLife(16);
    expectFabCard(Briar, cracklingRed).toBeIn("graveyard");
  });
});

/**
 * Crackling, Yellow (AUR015) — Elemental Runeblade Attack Action.
 *
 * Printed: "Lightning Flow - If you've played a Lightning card this turn,
 * this gets +1{p}."
 *
 * fab-rules Mode B handoff:
 *   citations: CR 5.3 (resolution ability generates its effect when the
 *     card-layer resolves), CR 6.2 (layer-continuous modify-numeric on the
 *     chain link), CR 8.1.5 (Lightning Flow — "played a Lightning card this
 *     turn" is the played-this turn status filtered by the Lightning
 *     supertype), CR 2.9 (power).
 *   behaviorConstraints:
 *     - The +1{p} applies only when a Lightning card was played earlier THIS
 *       TURN; without one the attack stays at its printed 2{p}.
 *     - The modifier is part of the attack's on-chain power before the
 *       damage step, so the hit deals 2+1 damage.
 *   testImplications:
 *     - Assert the chain link reads 3{p} after a Lightning card this turn,
 *       2{p} without one, and that the boosted link deals 3 damage.
 */

describe("Crackling (AUR015) AAA", () => {
  it("happy: after a Lightning card this turn, the attack reads 3{p} on the chain", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [cosmicFlareRed, cracklingYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    // Cosmic Flare (cost-0 Lightning instant) is the Lightning card played
    // this turn that enables Lightning Flow.
    Briar.play(cosmicFlareRed);
    game.helpers.resolveUntilIdle();

    Briar.playAttack(cracklingYellow);
    game.advanceCombatTo("defend");
    // Printed 2{p} + 1 from Lightning Flow = 3.
    expectCombat(game).toHaveAttackPower(3);
  });

  it("boundary: no Lightning card played this turn — the attack stays at printed 2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [cracklingYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.playAttack(cracklingYellow);
    game.advanceCombatTo("defend");
    // No Lightning card this turn: the conditional +1 never applies.
    expectCombat(game).toHaveAttackPower(2);
  });

  it("timing: the +1{p} is on the link before damage — the hit deals 3", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [cosmicFlareRed, cracklingYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.play(cosmicFlareRed);
    game.helpers.resolveUntilIdle();

    Briar.playAttack(cracklingYellow);
    expectCombat(game).toHaveAttackPower(3);
    game.helpers.resolveRestOfCombat();

    // 2 base + 1 Lightning Flow damage lands; the attack reaches the
    // graveyard.
    expectFabPlayer(Dash).toHaveLife(17);
    expectFabCard(Briar, cracklingYellow).toBeIn("graveyard");
  });
});
