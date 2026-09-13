import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { levia } from "../heroes/levia.ts";
import { shadowrealmHarvesterRed } from "./shadowrealm-harvester.ts";

describe("Shadowrealm Harvester (IAR175) AAA", () => {
  it("happy: from banished this is 7{p} with overpower", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [],
        banished: [shadowrealmHarvesterRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(levia).attackWith(shadowrealmHarvesterRed, { from: "banished" });
    expectCombat(game).toHaveAttackPower(7).toHaveKeyword("overpower");
    game.closeCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(13);
  });

  it("boundary: from hand this stays printed 6{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [shadowrealmHarvesterRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(levia).playAttack(shadowrealmHarvesterRed);
    expectCombat(game).toHaveAttackPower(6);
    game.closeCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(14);
  });

  it("timing: a copy left in banished costs 1 life at the end phase", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [],
        banished: [shadowrealmHarvesterRed],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);
    Levia.endTurn();
    expectFabPlayer(Levia).toHaveLife(19);
  });
});
