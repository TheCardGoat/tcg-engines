import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { halaBladesaintOfTheVow } from "../heroes/hala-bladesaint-of-the-vow.ts";
import { zenithBlade } from "../weapons/zenith-blade.ts";
import { olBlue } from "./ol.ts";

/**
 * Olé (AHA021) — Warrior Attack Reaction.
 *
 * Printed: Remove a +1{p} counter from target attacking weapon. If you do,
 * create a Flurry token and draw a card.
 *
 * remove-counters numeric +1{p} only stages events when the live object has
 * the stack (if-you-do then-branch). hasStatus attacking matches the open
 * chain attack by instance identity. Split leftover from Guardian off-hand −1{d}.
 */

describe("Olé (AHA021) AAA", () => {
  it("happy: removing a +1{p} counter from the attacking weapon creates Flurry and draws", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        hand: [olBlue],
        weapon1: [{ card: zenithBlade, state: { powerCounterTotal: 1 } }],
        resourcePoints: 2,
        actionPoints: 1,
        deckTop: [snatchRed],
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);

    Hala.activateAttack(zenithBlade);
    expectCombat(game).toHaveAttackPower(4);
    game.toReaction("attacker");

    Hala.play(olBlue);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(3);
    expectFabCard(Hala, zenithBlade).toHaveCounters(0);
    expectFabPlayer(Hala).toHaveTokenCount("flurry", 1);
    expectFabPlayer(Hala).toHaveHandCount(1);
    expectFabCard(Hala, olBlue).toBeIn("graveyard");
  });

  it("boundary: with no +1{p} counter the if-you-do does not create Flurry or draw", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        hand: [olBlue],
        weapon1: [zenithBlade],
        resourcePoints: 2,
        actionPoints: 1,
        deckTop: [snatchRed],
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);

    Hala.activateAttack(zenithBlade);
    expectCombat(game).toHaveAttackPower(3);
    game.toReaction("attacker");

    Hala.play(olBlue);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(3);
    expectFabPlayer(Hala).toHaveTokenCount("flurry", 0);
    expectFabPlayer(Hala).toHaveHandCount(0);
    expectFabCard(Hala, olBlue).toBeIn("graveyard");
  });

  it("timing: an attacking action card is not an attacking weapon", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        hand: [olBlue, snatchRed],
        weapon1: [{ card: zenithBlade, state: { powerCounterTotal: 1 } }],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);

    Hala.playAttack(snatchRed);
    game.toReaction("attacker");

    expectFabUnplayable(() => Hala.play(olBlue), /no legal|target|cannot be played|not legal/i);
    expectFabCard(Hala, olBlue).toBeIn("hand");
    expectFabPlayer(Hala).toHaveTokenCount("flurry", 0);
  });
});
