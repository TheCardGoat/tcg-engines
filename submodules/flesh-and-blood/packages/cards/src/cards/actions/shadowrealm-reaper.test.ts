import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { levia } from "../heroes/levia.ts";
import { shadowrealmReaperYellow } from "./shadowrealm-reaper.ts";

describe("Shadowrealm Reaper (IAR176) AAA", () => {
  it("happy: from banished this is 6{p} with go again", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [],
        banished: [shadowrealmReaperYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    Levia.attackWith(shadowrealmReaperYellow, { from: "banished" });
    expectCombat(game).toHaveAttackPower(6).toHaveKeyword("go-again");
    game.closeCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(14);
    expectFabPlayer(Levia).toHaveAP(1);
  });

  it("boundary: from hand this stays printed 5{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [shadowrealmReaperYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);
    Levia.playAttack(shadowrealmReaperYellow);
    expectCombat(game).toHaveAttackPower(5);
    game.closeCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(15);
  });

  it("timing: a copy left in banished costs 1 life at the end phase", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [],
        banished: [shadowrealmReaperYellow],
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
