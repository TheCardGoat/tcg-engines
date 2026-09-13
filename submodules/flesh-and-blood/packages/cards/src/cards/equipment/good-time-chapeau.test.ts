import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  fabToken,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { betsy } from "../heroes/betsy.ts";
import { dash } from "../heroes/dash.ts";
import { highRiser } from "../weapons/high-riser.ts";
import { browbeatBlue } from "../actions/browbeat.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { goodTimeChapeau } from "./good-time-chapeau.ts";

/**
 * Good Time Chapeau — Guardian Equipment - Head, d2 Temper. Betsy Specialization.
 *
 * Printed: "Action - Destroy a Gold you control: Your next attack this turn
 * gets 'When this attacks a hero, wager a Might and a Vigor token with them.'
 * Go again"
 */

describe("Good Time Chapeau (BET004) AAA", () => {
  it("happy: destroy a Gold, then the next attack wagers Might and Vigor", () => {
    const game = FabTestEngine.start(
      {
        hero: betsy,
        head: [goodTimeChapeau],
        weapon1: [highRiser],
        arena: [fabToken("gold")],
        hand: [],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Betsy = game.as(betsy);
    const Dash = game.as(dash);

    Betsy.activate(goodTimeChapeau);
    game.helpers.resolveUntilIdle();

    // Destroying the Gold paid the cost; go again kept the action point.
    expectFabPlayer(Betsy).toHaveTokenCount("gold", 0);
    expectFabPlayer(Betsy).toHaveAP(2);

    Betsy.activateAttack(highRiser);
    Dash.defendWith();
    game.closeCombat({ optionals: "decline" });

    // The wagered attack hit: Betsy takes the Might prize, Dash gets no Vigor.
    expectFabPlayer(Dash).toHaveLife(17);
    expectFabPlayer(Betsy).toHaveTokenCount("might", 1);
    expectFabPlayer(Dash).toHaveTokenCount("vigor", 0);
  });

  it("boundary: without a Gold you control, destroying one is an unpayable cost", () => {
    const game = FabTestEngine.start(
      {
        hero: betsy,
        head: [goodTimeChapeau],
        weapon1: [highRiser],
        hand: [],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Betsy = game.as(betsy);

    Betsy.expectActivationRejected(goodTimeChapeau);
    expectFabPlayer(Betsy).toHaveTokenCount("gold", 0);
  });

  it("timing: a wager that misses gives the defender the Vigor prize", () => {
    const game = FabTestEngine.start(
      {
        hero: betsy,
        head: [goodTimeChapeau],
        weapon1: [highRiser],
        arena: [fabToken("gold")],
        hand: [],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [browbeatBlue, nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Betsy = game.as(betsy);
    const Dash = game.as(dash);

    Betsy.activate(goodTimeChapeau);
    game.helpers.resolveUntilIdle();

    Betsy.activateAttack(highRiser);
    Dash.defendWith(browbeatBlue, nimblismBlue);
    game.closeCombat({ optionals: "decline" });

    // 5{d} ≥ 3{p}: the attack misses, so the Vigor prize goes to Dash.
    expectFabPlayer(Dash).toHaveLife(20);
    expectFabPlayer(Betsy).toHaveTokenCount("might", 0);
    expectFabPlayer(Dash).toHaveTokenCount("vigor", 1);
  });
});
