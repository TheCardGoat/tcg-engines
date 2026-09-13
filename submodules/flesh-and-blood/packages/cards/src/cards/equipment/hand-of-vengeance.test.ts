import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { fang } from "../heroes/fang.ts";
import { arakni } from "../heroes/arakni.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { handOfVengeance } from "./hand-of-vengeance.ts";

/**
 * Hand of Vengeance — Draconic Equipment - Arms, d1 Blade Break.
 *
 * Printed: "Attack Reaction - Destroy this: Target attack that is attacking
 * Arakni gets +1{p}."
 */

describe("Hand of Vengeance (HNT146) AAA", () => {
  it("happy: destroy this as an AR to give the attack on Arakni +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        arms: [handOfVengeance],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: arakni, hand: [], life: 40, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);
    const Arakni = game.as(arakni);

    Fang.playAttack(snatchRed);
    Arakni.defendWith();
    game.toReaction("attacker");

    Fang.activate(handOfVengeance);
    game.passBoth();
    expectCombat(game).toHaveAttackPower(5);
    game.passBoth();
    game.helpers.resolveRestOfCombat();

    expectFabCard(Fang, handOfVengeance).toBeIn("graveyard");
    expectFabPlayer(Arakni).toHaveLife(35);
  });

  it("boundary: an attack that is not attacking Arakni cannot be targeted", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        arms: [handOfVengeance],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.playAttack(snatchRed);
    game.as(dash).defendWith();
    game.toReaction("attacker");

    Fang.expectActivationRejected(handOfVengeance);
    expectFabCard(Fang, handOfVengeance).toBeIn("arms");
    expectCombat(game).toHaveAttackPower(4);
  });
});
