import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { kassaiOfTheGoldenSand } from "../heroes/kassai-of-the-golden-sand.ts";
import { dash } from "../heroes/dash.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { cuttingCouriers } from "./cutting-couriers.ts";

/**
 * Cutting Couriers — Warrior Legs d0.
 * Printed: "When your sword attack hits, you may destroy this. If you do,
 * the attack gets go again."
 */

describe("Cutting Couriers AAA", () => {
  it("happy: on a sword hit, destroying the couriers gives the attack go again", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        legs: [cuttingCouriers],
        weapon1: [cintariSaber],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.activateAttack(cintariSaber);
    game.as(dash).defendWith();
    game.closeCombat({ optionals: "accept", ordering: "listed" });

    expectFabCard(Kassai, cuttingCouriers).toBeIn("graveyard");
    // Go again on the resolving chain link pays the action point back.
    expectFabPlayer(Kassai).toHaveAP(1);
  });

  it("boundary: declining keeps the couriers equipped and grants no action point", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        legs: [cuttingCouriers],
        weapon1: [cintariSaber],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.activateAttack(cintariSaber);
    game.as(dash).defendWith();
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabCard(Kassai, cuttingCouriers).toBeIn("legs");
    expectFabPlayer(Kassai).toHaveAP(0);
  });
});
