import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { katsu } from "../heroes/katsu.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { twinTwistersRed } from "./twin-twisters.ts";

/**
 * Twin Twisters, Red (EVR047) — choose +1{p} or next-attack-on-hit +1{p}. Printed go again.
 */

describe("Twin Twisters (EVR047) AAA", () => {
  it("happy: choosing +1{p} hits for 4 and refunds AP", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [twinTwistersRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.play(twinTwistersRed, {
      modeIds: [`${twinTwistersRed.canonicalId}:chooseMode:gain1Power`],
    });
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(4).toHaveKeyword("go-again");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(16);
    expectFabPlayer(Katsu).toHaveAP(1);
  });

  it("boundary: choosing the hit grant does not add +1{p} to this attack", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [twinTwistersRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.play(twinTwistersRed, {
      modeIds: [`${twinTwistersRed.canonicalId}:chooseMode:grantPowerToNextAttackOnHit`],
    });
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(3);
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(game.as(dash)).toHaveLife(17);
    expectFabPlayer(Katsu).toHaveAP(1);
  });

  it("boundary: defends for its printed 2{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [twinTwistersRed],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Katsu = game.as(katsu);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Katsu.defendWith([twinTwistersRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Katsu).toHaveLife(18);
  });
});
