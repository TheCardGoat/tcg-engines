import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { zeroToSixtyRed } from "../actions/zero-to-sixty.ts";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "../actions/brutal-assault.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { punctureRed } from "../attack-reactions/puncture.ts";
import { crouchingTiger } from "../actions/crouching-tiger.ts";
import { kassaiOfTheGoldenSand } from "../heroes/kassai-of-the-golden-sand.ts";
import { scarForAScarRed } from "../actions/scar-for-a-scar.ts";
import { rapidReflexRed } from "../attack-reactions/rapid-reflex.ts";
import { rapidReflexYellow } from "../attack-reactions/rapid-reflex.ts";
import { rapidReflexBlue } from "../attack-reactions/rapid-reflex.ts";
import { enlightenedStrikeRed } from "../actions/enlightened-strike.ts";
import { snatchRed } from "../actions/snatch.ts";
import { tigerTrapRed } from "./tiger-trap.ts";

/**
 * Tiger Trap (PEN083) — Ranger Defense Reaction Trap.
 *
 * Printed: When this defends and the attacking hero controls 3 or more attacks
 * with {p} greater than their base, attacks they control can't gain {p} this
 * turn.
 */

describe("Tiger Trap (PEN083) AAA", () => {
  it("prevents gains after it defends the third above-base attack on the open chain", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [
          zeroToSixtyRed,
          scarForAScarRed,
          snatchRed,
          rapidReflexRed,
          rapidReflexYellow,
          rapidReflexBlue,
          enlightenedStrikeRed,
          brutalAssaultBlue,
        ],
        resourcePoints: 3,
        actionPoints: 4,
        deck: 6,
      },
      { hero: dash, hand: [tigerTrapRed], life: 40, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    const firstAttack = Bravo.must.playAttack(zeroToSixtyRed);
    game.toReaction("attacker");
    Bravo.must.playReaction(rapidReflexRed, {
      targetCard: firstAttack,
    });
    game.passBoth();
    game.advanceCombatTo("resolution");
    const secondAttack = Bravo.must.playAttack(scarForAScarRed);
    game.toReaction("attacker");
    Bravo.must.playReaction(rapidReflexYellow, {
      targetCard: secondAttack,
    });
    game.passBoth();
    game.advanceCombatTo("resolution");
    const thirdAttack = Bravo.must.playAttack(snatchRed);
    game.toReaction("attacker");
    Bravo.must.playReaction(rapidReflexBlue, {
      targetCard: thirdAttack,
    });
    game.passBoth();
    expectCombat(game).toHaveAttackPower(5);
    game.toReaction("defender");
    Dash.must.playReaction(tigerTrapRed);
    game.passBoth();
    game.passBoth();

    expectCombat(game).toHaveAttackPower(4);
    game.advanceCombatTo("resolution");
    Bravo.play(enlightenedStrikeRed, { modeIndexes: [1] });
    game.passBoth();

    expectCombat(game).toHaveAttackPower(5);
    expectFabCard(Dash, tigerTrapRed).toBeIn("combatChain");
  });

  it("does not arm when only two attacks on the chain are above their base power", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [
          zeroToSixtyRed,
          scarForAScarRed,
          snatchRed,
          rapidReflexRed,
          rapidReflexYellow,
          rapidReflexBlue,
        ],
        resourcePoints: 3,
        actionPoints: 3,
        deck: 6,
      },
      { hero: dash, hand: [tigerTrapRed], life: 40, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    const firstAttack = Bravo.must.playAttack(zeroToSixtyRed);
    game.toReaction("attacker");
    Bravo.must.playReaction(rapidReflexRed, {
      targetCard: firstAttack,
    });
    game.passBoth();
    game.advanceCombatTo("resolution");
    const secondAttack = Bravo.must.playAttack(scarForAScarRed);
    game.toReaction("attacker");
    Bravo.must.playReaction(rapidReflexYellow, {
      targetCard: secondAttack,
    });
    game.passBoth();
    game.advanceCombatTo("resolution");
    const thirdAttack = Bravo.must.playAttack(snatchRed);
    game.toReaction("defender");
    Dash.must.playReaction(tigerTrapRed);
    game.passBoth();

    Bravo.must.playReaction(rapidReflexBlue, {
      targetCard: thirdAttack,
    });
    game.passBoth();

    expectCombat(game).toHaveAttackPower(5);
  });

  it("counts a weapon attack by chain-link LKI instead of physical zone occupancy", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        life: 20,
        weapon1: [cintariSaber],
        hand: [crouchingTiger, crouchingTiger, rapidReflexRed, rapidReflexYellow, punctureRed],
        resourcePoints: 4,
        actionPoints: 3,
        deck: 6,
      },
      { hero: dash, hand: [tigerTrapRed], life: 40, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);
    const Dash = game.as(dash);
    const tigers = Kassai.cardsIn("hand", crouchingTiger);

    const firstAttack = Kassai.must.playAttack(tigers[0]!);
    game.toReaction("attacker");
    Kassai.must.playReaction(rapidReflexRed, { targetCard: firstAttack });
    game.passBoth();
    expectCombat(game).toHaveAttackPower(3);
    expectCombat(game).toHaveKeyword("go-again");
    game.advanceCombatTo("resolution");

    const secondAttack = Kassai.must.playAttack(tigers[1]!);
    game.toReaction("attacker");
    Kassai.must.playReaction(rapidReflexYellow, { targetCard: secondAttack });
    game.passBoth();
    expectCombat(game).toHaveKeyword("go-again");
    game.advanceCombatTo("resolution");

    const saber = Kassai.ref(cintariSaber);
    Kassai.activateAttack(cintariSaber);
    game.toReaction("attacker");
    Kassai.must.playReaction(punctureRed, { targetCard: saber });
    game.passBoth();
    expectCombat(game).toHaveAttackPower(5);

    game.toReaction("defender");
    Dash.must.playReaction(tigerTrapRed);
    game.passBoth();
    game.passBoth();

    expectCombat(game).toHaveAttackPower(2);
  });

  it("timing: cannot play Tiger Trap outside the reaction step", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [tigerTrapRed], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expectFabUnplayable(
      () => game.as(dash).play(tigerTrapRed),
      /not legal in the current reaction step/i,
    );
    expectFabCard(game.as(dash), tigerTrapRed).toBeIn("hand");
  });
});
