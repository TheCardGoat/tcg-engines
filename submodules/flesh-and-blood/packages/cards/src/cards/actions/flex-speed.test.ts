import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { levia } from "../heroes/levia.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { flexSpeedRed } from "./flex-speed.ts";

/**
 * Flex Speed, Red (SUP146) — go again if this has 6 or more {p}.
 */

describe("Flex Speed (SUP146) AAA", () => {
  it("happy: a start-of-turn Might raises this to 6{p} and grants go again", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], life: 20, deck: 6 },
      {
        hero: levia,
        arena: [fabToken("might")],
        hand: [flexSpeedRed, nimblismBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    game.as(dash).endTurn();
    game.untilIdle({ ordering: "listed" });

    Levia.must.pitch(nimblismBlue).playAttack(flexSpeedRed);
    game.passBoth();
    expectCombat(game).toHaveAttackPower(6);
    expectCombat(game).toHaveKeyword("go-again");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Levia).toHaveAP(1);
  });

  it("boundary: printed 5{p} does not get go again", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [flexSpeedRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    Levia.attackWith(flexSpeedRed);
    expectCombat(game).notToHaveKeyword("go-again").toHaveAttackPower(5);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Levia).toHaveAP(0);
  });

  it("boundary: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [flexSpeedRed],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Levia = game.as(levia);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Levia.defendWith([flexSpeedRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Levia).toHaveLife(19);
  });
});
