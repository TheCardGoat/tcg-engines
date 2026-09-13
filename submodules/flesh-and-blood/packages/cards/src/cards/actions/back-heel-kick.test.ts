import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { twinTwistersRed } from "./twin-twisters.ts";
import { katsu } from "../heroes/katsu.ts";
import { nimblismBlue } from "./nimblism.ts";
import { backHeelKickRed } from "./back-heel-kick.ts";

/**
 * Back Heel Kick Red (BEN008) — Ninja Attack Action, 3{p}.
 *
 * Printed (Errata Bulletin #6): Combo — If Twin Twisters was the last attack
 * this combat chain, while this is face-up in any zone and would gain {p},
 * instead it gains that much plus 1.
 */

describe("Back Heel Kick (BEN008) AAA", () => {
  it("happy: Combo amps Twin Twisters' next-attack +1{p} into +2 on the same chain", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [twinTwistersRed, backHeelKickRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);
    const Dash = game.as(dash);

    Katsu.playAttack(twinTwistersRed, {
      modeIds: [`${twinTwistersRed.canonicalId}:chooseMode:grantPowerToNextAttackOnHit`],
    });
    Dash.defendWith();
    game.advanceUntil({ stopAt: "resolution", optionals: "decline", ordering: "listed" });
    Katsu.playAttack(backHeelKickRed);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(5);
    Dash.defendWith();
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(12);
  });

  it("boundary: without Twin Twisters last, Nimblism stays +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [nimblismBlue, backHeelKickRed],
        resourcePoints: 0,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);
    const Dash = game.as(dash);

    Katsu.play(nimblismBlue);
    game.helpers.resolveUntilIdle();
    Katsu.playAttack(backHeelKickRed);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(4);
    Dash.defendWith();
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(16);
  });

  it("timing: Combo does not add {p} unless this would gain {p}", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [twinTwistersRed, backHeelKickRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);
    const Dash = game.as(dash);

    Katsu.playAttack(twinTwistersRed, {
      modeIds: [`${twinTwistersRed.canonicalId}:chooseMode:gain1Power`],
    });
    Dash.defendWith();
    game.advanceUntil({ stopAt: "resolution", optionals: "decline", ordering: "listed" });
    Katsu.playAttack(backHeelKickRed);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(3);
    Dash.defendWith();
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(13);
  });
});
