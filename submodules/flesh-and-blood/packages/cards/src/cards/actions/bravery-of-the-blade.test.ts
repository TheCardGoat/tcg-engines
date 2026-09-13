import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { boltyn } from "../heroes/boltyn.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { braveryOfTheBladeRed } from "./bravery-of-the-blade.ts";

describe("Bravery of the Blade (IAR) AAA", () => {
  it("happy: charging gives the attack go again and creates Courage when it hits", () => {
    const game = FabTestEngine.start(
      { hero: boltyn, hand: [braveryOfTheBladeRed, nimblismBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);
    const Dash = game.as(dash);

    Boltyn.playAttack(braveryOfTheBladeRed, { charge: true, chargeCard: nimblismBlue });
    expectCombat(game).toHaveKeyword("go-again");
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(17);
    expectFabPlayer(Boltyn).toHaveTokenCount("courage", 1).toHaveAP(1);
  });

  it("boundary: declining charge leaves no Courage rider on the hit", () => {
    const game = FabTestEngine.start(
      { hero: boltyn, hand: [braveryOfTheBladeRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);
    const Dash = game.as(dash);

    Boltyn.playAttack(braveryOfTheBladeRed);
    expectCombat(game).notToHaveKeyword("go-again");
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(17);
    expectFabPlayer(Boltyn).toHaveTokenCount("courage", 0).toHaveAP(0);
  });
});
