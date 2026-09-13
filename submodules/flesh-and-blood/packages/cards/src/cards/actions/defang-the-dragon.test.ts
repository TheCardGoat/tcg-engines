import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakni } from "../heroes/arakni.ts";
import { fang } from "../heroes/fang.ts";
import { defangTheDragonRed } from "./defang-the-dragon.ts";

describe("Defang the Dragon (HNT030) AAA", () => {
  it("happy: attacking registers a contract to hit a marked hero named Fang", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [defangTheDragonRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: fang, hand: [], marked: true, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.attackWith(defangTheDragonRed);
    expectCombat(game).toHaveAttackPower(3);
    expectCombat(game).toHaveKeyword("stealth");
    expectFabPlayer(Arakni).toHaveActiveContract("hit a marked hero named Fang");
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Arakni).toHaveHandCount(1);
  });

  it("boundary: hitting an unmarked Fang does not complete the contract", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [defangTheDragonRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: fang, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Fang = game.as(fang);

    Arakni.attackWith(defangTheDragonRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Fang).toHaveLife(17);
    expectFabPlayer(Arakni).toHaveHandCount(0);
  });

  it("boundary: hitting a marked hero who is not Fang does not complete the contract", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [defangTheDragonRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], marked: true, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.attackWith(defangTheDragonRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(17);
    expectFabPlayer(Arakni).toHaveHandCount(0);
  });
});
