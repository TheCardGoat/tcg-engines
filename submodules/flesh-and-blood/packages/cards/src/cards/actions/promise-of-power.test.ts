import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { chane } from "../heroes/chane.ts";
import { bloodfrenzyGloombladeRed } from "./bloodfrenzy-gloomblade.ts";
import { promiseOfPowerYellow } from "./promise-of-power.ts";

/**
 * Promise of Power, Yellow — Shadow Runeblade Action, cost 1, 2{d}.
 *
 * Printed: "The next time you play an attack action card from your banished
 * zone this turn, create 2 Runechant tokens. Go again"
 */

describe("Promise of Power AAA", () => {
  it("happy: the next attack action played from banished creates 2 Runechants", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [promiseOfPowerYellow],
        banished: [bloodfrenzyGloombladeRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);
    const Dash = game.as(dash);

    Chane.play(promiseOfPowerYellow);
    game.untilIdle();
    expectFabPlayer(Chane).toHaveAP(1).toHaveTokenCount("runechant", 0);

    Chane.playAttack(bloodfrenzyGloombladeRed, { from: "banished" });
    expectCombat(game).toBeAtStep("defend").toHaveAttackPower(3);
    expectFabPlayer(Chane).toHaveTokenCount("runechant", 2);
    Dash.defendWith();
    game.closeCombat();
    expectFabCard(Chane, promiseOfPowerYellow).toBeIn("graveyard");
  });

  it("boundary: an attack action played from hand does not create the Runechants", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [promiseOfPowerYellow, bloodfrenzyGloombladeRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.play(promiseOfPowerYellow);
    game.untilIdle();
    Chane.playAttack(bloodfrenzyGloombladeRed);
    expectCombat(game).toBeAtStep("defend").toHaveAttackPower(3);
    expectFabPlayer(Chane).toHaveTokenCount("runechant", 0);
  });
});
