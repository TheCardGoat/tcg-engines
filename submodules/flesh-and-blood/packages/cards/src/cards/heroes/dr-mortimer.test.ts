import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  expectFabToken,
  fabToken,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { drMortimer } from "./dr-mortimer.ts";
import { prowlRed } from "../actions/prowl.ts";

/**
 * Dr. Mortimer (MPA003) — Assassin Hero - Young.
 *
 * Printed:
 *   Instant - {t}: Cure a disease an opponent controls. If you do, create a
 *   Silver token.
 *   Attack Reaction - {t}, destroy 2 Silver you control: Target Assassin
 *   attack gets go again.
 */

const CURE_ABILITY = `${drMortimer.canonicalId}:instantTapCureDiseaseOpponentControlsCreateSilverToken`;
const GO_AGAIN_ABILITY = `${drMortimer.canonicalId}:attackReactionTapDestroy2SilverTargetAssassinAttackGetsGoAgain`;

describe("Dr. Mortimer (MPA003) AAA", () => {
  it("happy: curing a disease the opponent controls creates a Silver token", () => {
    const game = FabTestEngine.start(
      {
        hero: drMortimer,
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, arena: [fabToken("frailty")], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Mortimer = game.as(drMortimer);

    Mortimer.activate(drMortimer, { abilityId: CURE_ABILITY });
    game.helpers.resolveUntilIdle();

    expectFabToken(game, "frailty").toHaveCount(0);
    expectFabPlayer(Mortimer).toHaveTokenCount("silver", 1);
  });

  it("boundary: with no disease to cure, no Silver is created", () => {
    const game = FabTestEngine.start(
      {
        hero: drMortimer,
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Mortimer = game.as(drMortimer);

    Mortimer.activate(drMortimer, { abilityId: CURE_ABILITY });
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Mortimer).toHaveTokenCount("silver", 0);
  });

  it("timing: tapping and destroying 2 Silver gives the Assassin attack go again", () => {
    const game = FabTestEngine.start(
      {
        hero: drMortimer,
        hand: [prowlRed],
        arena: [fabToken("silver"), fabToken("silver")],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Mortimer = game.as(drMortimer);

    Mortimer.playAttack(prowlRed);
    game.toReaction("attacker");
    Mortimer.activate(drMortimer, { abilityId: GO_AGAIN_ABILITY });
    game.passBoth();
    expectCombat(game).toBeOpen().toHaveKeyword("go-again");
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    // The 2 Silver were destroyed as part of the cost; Prowl Red hit for 3.
    expectFabPlayer(Mortimer).toHaveTokenCount("silver", 0);
    expectFabPlayer(game.as(dash)).toHaveLife(17);
  });

  it("boundary: with fewer than 2 Silver, the attack reaction cannot be paid", () => {
    const game = FabTestEngine.start(
      {
        hero: drMortimer,
        hand: [prowlRed],
        arena: [fabToken("silver")],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Mortimer = game.as(drMortimer);

    Mortimer.playAttack(prowlRed);
    game.toReaction("attacker");

    Mortimer.expectActivationRejected(drMortimer);
    expectFabPlayer(Mortimer).toHaveTokenCount("silver", 1);
  });
});
