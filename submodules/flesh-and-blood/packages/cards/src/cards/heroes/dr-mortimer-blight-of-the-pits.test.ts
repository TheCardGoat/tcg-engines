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
import { drMortimerBlightOfThePits } from "./dr-mortimer-blight-of-the-pits.ts";
import { prowlRed } from "../actions/prowl.ts";

/**
 * Dr. Mortimer, Blight of the Pits (AMO001) — Assassin Hero (adult).
 *
 * Printed:
 *   Instant - {t}: Cure a disease an opponent controls. If you do, create a
 *   Silver token.
 *   Attack Reaction - {t}, destroy 2 Silver you control: Target Assassin
 *   attack gets go again.
 */

const CURE_ABILITY = `${drMortimerBlightOfThePits.canonicalId}:instantTapCureDiseaseOpponentControlsCreateSilverToken`;
const GO_AGAIN_ABILITY = `${drMortimerBlightOfThePits.canonicalId}:attackReactionTapDestroy2SilverTargetAssassinAttackGetsGoAgain`;

describe("Dr. Mortimer, Blight of the Pits (AMO001) AAA", () => {
  it("happy: curing a disease the opponent controls creates a Silver token", () => {
    const game = FabTestEngine.start(
      {
        hero: drMortimerBlightOfThePits,
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, arena: [fabToken("frailty")], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Mortimer = game.as(drMortimerBlightOfThePits);

    Mortimer.activate(drMortimerBlightOfThePits, { abilityId: CURE_ABILITY });
    game.helpers.resolveUntilIdle();

    expectFabToken(game, "frailty").toHaveCount(0);
    expectFabPlayer(Mortimer).toHaveTokenCount("silver", 1);
  });

  it("timing: tapping and destroying 2 Silver gives the Assassin attack go again", () => {
    const game = FabTestEngine.start(
      {
        hero: drMortimerBlightOfThePits,
        hand: [prowlRed],
        arena: [fabToken("silver"), fabToken("silver")],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Mortimer = game.as(drMortimerBlightOfThePits);

    Mortimer.playAttack(prowlRed);
    game.toReaction("attacker");
    Mortimer.activate(drMortimerBlightOfThePits, { abilityId: GO_AGAIN_ABILITY });
    game.passBoth();
    expectCombat(game).toBeOpen().toHaveKeyword("go-again");
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    // The 2 Silver were destroyed as part of the cost; Prowl Red hit for 3.
    expectFabPlayer(Mortimer).toHaveTokenCount("silver", 0);
    expectFabPlayer(game.as(dash)).toHaveLife(17);
  });
});
