import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { cindra } from "../heroes/cindra.ts";
import { arakni } from "../heroes/arakni.ts";
import { extinguishTheFlamesRed } from "./extinguish-the-flames.ts";

describe("Extinguish the Flames (HNT031) AAA", () => {
  it("happy: attacking registers a contract to hit a marked hero named Cindra", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [extinguishTheFlamesRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: cindra, hand: [], marked: true, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.attackWith(extinguishTheFlamesRed);
    expectCombat(game).toHaveAttackPower(3);
    expectCombat(game).toHaveKeyword("stealth");
    expectFabPlayer(Arakni).toHaveActiveContract("hit a marked hero named Cindra");
  });

  it("boundary: hitting an unmarked Cindra does not complete the contract", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [extinguishTheFlamesRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: cindra, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Cindra = game.as(cindra);

    Arakni.attackWith(extinguishTheFlamesRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Cindra).toHaveLife(17);
    expectFabPlayer(Arakni).toHaveHandCount(0);
  });

  it("boundary: hitting a marked hero who is not Cindra does not complete the contract", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [extinguishTheFlamesRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], marked: true, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.attackWith(extinguishTheFlamesRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(17);
    expectFabPlayer(Arakni).toHaveHandCount(0);
  });
});
