import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { kassai } from "../heroes/kassai.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { outForBloodBlue } from "../attack-reactions/out-for-blood.ts";
import { valiantDynamo } from "../equipment/valiant-dynamo.ts";
import { gauntletsOfIronWill } from "./gauntlets-of-iron-will.ts";

/**
 * Gauntlets of Iron Will — Guardian Equipment - Arms, d2 Temper.
 *
 * Printed: "When this defends, the next time an attack would gain {p} this
 * chain link, instead it gains that much minus 1."
 * Out for Blood's +1{p} weapon gain becomes +0 while the gauntlets defend.
 */

describe("Gauntlets of Iron Will (HVY053) AAA", () => {
  it("happy: when the gauntlets defend, Out for Blood's +1{p} gain is reduced to +0", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        weapon1: [cintariSaber],
        hand: [outForBloodBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, arms: [gauntletsOfIronWill], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);
    const Bravo = game.as(bravo);

    Kassai.activateAttack(cintariSaber);
    Bravo.defendWith(gauntletsOfIronWill);
    game.toReaction("attacker");

    Kassai.play(outForBloodBlue);
    game.passBoth();

    // Saber 2{p} + (1 − 1) — the gauntlets rewrote the gain this chain link.
    expectCombat(game).toHaveAttackPower(2);
  });

  it("boundary: without the gauntlets defending, the same gain applies in full", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        weapon1: [cintariSaber],
        hand: [outForBloodBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, arms: [gauntletsOfIronWill], legs: [valiantDynamo], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);
    const Bravo = game.as(bravo);

    // Defending with other equipment (not the gauntlets) — the +1{p} gain is
    // untouched and no replacement was registered this chain link.
    Kassai.activateAttack(cintariSaber);
    Bravo.defendWith(valiantDynamo);
    game.toReaction("attacker");

    Kassai.play(outForBloodBlue);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(3);
  });
});
