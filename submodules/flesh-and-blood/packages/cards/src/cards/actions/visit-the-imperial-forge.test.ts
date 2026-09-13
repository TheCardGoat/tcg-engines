import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { ironrotGauntlet } from "../equipment/ironrot-gauntlet.ts";
import { snatchRed } from "./snatch.ts";
import { quicksilverDagger } from "../weapons/quicksilver-dagger.ts";
import { visitTheImperialForgeRed } from "./visit-the-imperial-forge.ts";

/**
 * Visit the Imperial Forge, Red (DYN085) — Warrior Action, cost 0, pitch 1.
 * Printed: "Sword and dagger attacks have piercing 3 this turn.\nGo again"
 *
 * fab-rules Mode B handoff:
 *   citations: CR 8.3.23 (piercing: +N attack power while an equipment card
 *     defends the attack), CR 5.3 (resolution ability), CR 2.9 (power).
 *   behaviorConstraints:
 *     - The piercing 3 grant floats at resolution and re-evaluates membership
 *       per chain link: every sword/dagger attack this turn — including ones
 *       declared AFTER the forge resolves — carries piercing 3.
 *     - Non-sword/dagger attacks never receive it.
 *     - The grant expires when the turn ends.
 *   testImplications:
 *     - Quicksilver Dagger (DYN069) weapon attack (1{p}) defended by Ironrot
 *       Gauntlet reads 1+3 = 4 attack power (CR 8.3.23 projection).
 *     - Snatch (no Sword/Dagger subtype) defended by the same gauntlet stays
 *       at its printed 4{p}.
 *     - Next turn's dagger attack defended by equipment reads 1{p} again.
 */

describe("Visit the Imperial Forge (DYN085) AAA", () => {
  it("happy: this turn's dagger attack defended by equipment reads +3 attack power, and the forge refunds its action point", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [quicksilverDagger],
        hand: [visitTheImperialForgeRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, arms: [ironrotGauntlet], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    // Cost 0; the printed go again refunds the action point at resolution.
    Bravo.play(visitTheImperialForgeRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Bravo).toHaveAP(2);

    // Quicksilver Dagger attacks (1{p}); the floating grant re-evaluates on
    // this later-declared link and arms it with piercing 3. Weapon activation
    // parks the attack-with ability on the stack — advance to the defend step.
    Bravo.activate(quicksilverDagger);
    game.advanceCombatTo("defend");
    Dash.defendWith(ironrotGauntlet);
    expectCombat(game).toBeAtStep("defend").toHaveAttackPower(4);
    game.helpers.resolveRestOfCombat();

    // 4 attack power − 1 equipment defense = 3 damage.
    expectFabPlayer(Dash).toHaveLife(17);
  });

  it("boundary: a non-sword, non-dagger attack never gains the piercing 3", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [visitTheImperialForgeRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, arms: [ironrotGauntlet], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(visitTheImperialForgeRed);
    game.helpers.resolveUntilIdle();

    // Snatch has no Sword/Dagger subtype: the equipment defense must not
    // collect any piercing bonus.
    Bravo.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Dash.defendWith(ironrotGauntlet);
    expectCombat(game).toBeAtStep("defend").toHaveAttackPower(4);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(17); // 4 − 1
  });

  it("timing: the grant expires — next turn's dagger attack reads 1{p} against the same equipment", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [quicksilverDagger],
        hand: [visitTheImperialForgeRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, arms: [ironrotGauntlet], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    // Forge resolves this turn, but no sword/dagger attack is declared.
    Bravo.play(visitTheImperialForgeRed);
    game.helpers.resolveUntilIdle();
    Bravo.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    Dash.endTurn();
    game.helpers.resolveUntilIdle();

    // New turn: floating resources reset at the turn rollover, so the
    // dagger's {r} is paid by answering the payment decision with a pitch
    // (EVR055 answer-decision pattern). "This turn" has rolled over — the
    // link must NOT carry piercing 3.
    Bravo.activate(quicksilverDagger);
    game.answerDecision(Bravo.id, {
      kind: "payment",
      instanceIds: [Bravo.cardIn("hand", snatchRed).instanceId],
    });
    game.advanceCombatTo("defend");
    Dash.defendWith(ironrotGauntlet);
    expectCombat(game).toBeAtStep("defend").toHaveAttackPower(1);
    game.helpers.resolveRestOfCombat();

    // 1 − 1: nothing gets through.
    expectFabPlayer(Dash).toHaveLife(20);
  });
});
