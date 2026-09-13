import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { uzuri } from "../heroes/uzuri.ts";
import { dash } from "../heroes/dash.ts";
import { startingPoint } from "./starting-point.ts";
import { exposedBlue } from "../attack-reactions/exposed.ts";
import { snatchRed, snatchYellow } from "../actions/snatch.ts";

/**
 * Starting Point (ARK006) — Assassin / Warrior Equipment - Legs.
 *
 * Printed: "Attack Reaction - Destroy this: Target attack gets go again.
 * Activate this only if you've played a card or activated an ability this
 * reaction step."
 */
describe("Starting Point (ARK006) AAA", () => {
  it("happy: after an attack reaction, destroying the legs gives the attack go again", () => {
    const game = FabTestEngine.start(
      {
        hero: uzuri,
        legs: [startingPoint],
        hand: [snatchRed, exposedBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchYellow], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Uzuri = game.as(uzuri);
    const Dash = game.as(dash);

    const _attack = Uzuri.playAttack(snatchRed);
    Dash.defendWith(snatchYellow);
    game.toReaction("attacker");

    // Satisfy the gate: play an attack reaction (+1{p}) this reaction step.
    Uzuri.must.playReaction(exposedBlue);
    game.passBoth();
    expectCombat(game).toHaveAttackPower(5);

    // Now the Attack Reaction may destroy the legs and grant go again.
    Uzuri.activate(startingPoint);
    Uzuri.chooseTargets(snatchRed);
    game.helpers.closeCombat();

    // The attack resolved with go again: the spent action point is refunded.
    expectFabPlayer(Uzuri).toHaveAP(1);
    expectFabCard(Uzuri, startingPoint).toBeIn("graveyard");
    // 5{p} minus the 2{d} block lands 3 on Dash.
    expectFabPlayer(Dash).toHaveLife(17);
  });

  it("boundary: activating before playing anything this reaction step is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: uzuri,
        legs: [startingPoint],
        hand: [snatchRed, exposedBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchYellow], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Uzuri = game.as(uzuri);
    const Dash = game.as(dash);

    const _attack = Uzuri.playAttack(snatchRed);
    Dash.defendWith(snatchYellow);
    game.toReaction("attacker");

    // Nothing has been played or activated this reaction step yet.
    Uzuri.expectActivationRejected(startingPoint);
    expectFabCard(Uzuri, startingPoint).toBeIn("legs");

    // Playing the attack reaction opens the window, and the legs resolve.
    Uzuri.must.playReaction(exposedBlue);
    game.passBoth();
    Uzuri.activate(startingPoint);
    Uzuri.chooseTargets(snatchRed);
    game.helpers.closeCombat();
    expectFabPlayer(Uzuri).toHaveAP(1);
  });
});
