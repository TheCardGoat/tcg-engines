import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { levia } from "../heroes/levia.ts";
import { shadowrealmHarrowerBlue } from "./shadowrealm-harrower.ts";

describe("Shadowrealm Harrower (IAR174) AAA", () => {
  it("happy: from banished this is 5{p} and gains life equal to the hit", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [],
        banished: [shadowrealmHarrowerBlue],
        resourcePoints: 2,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    Levia.attackWith(shadowrealmHarrowerBlue, { from: "banished" });
    expectCombat(game).toHaveAttackPower(5);
    game.closeCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(15);
    expectFabPlayer(Levia).toHaveLife(25);
  });

  it("boundary: from hand this stays printed 4{p} and does not gain life", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [shadowrealmHarrowerBlue],
        resourcePoints: 2,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);
    Levia.playAttack(shadowrealmHarrowerBlue);
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(16);
    expectFabPlayer(Levia).toHaveLife(20);
  });

  it("timing: a copy left in banished costs 1 life at the end phase", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [],
        banished: [shadowrealmHarrowerBlue],
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
