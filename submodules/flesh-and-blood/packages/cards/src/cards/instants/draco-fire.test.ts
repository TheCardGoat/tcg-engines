import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { breakingPointRed } from "../actions/breaking-point.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { dracoFireRed } from "./draco-fire.ts";

describe("Draco Fire (OMN245) AAA", () => {
  it("happy: next Draconic attack this turn gets +2{p} and costs {r} less", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [dracoFireRed, breakingPointRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 40, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(dracoFireRed);
    game.untilIdle();
    Bravo.playAttack(breakingPointRed);

    expectCombat(game).toHaveAttackPower(7);
    expectFabPlayer(Bravo).toHaveResourceCount(0);
  });

  it("boundary: a non-Draconic attack does not get +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [dracoFireRed, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 40, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(dracoFireRed);
    game.untilIdle();
    Bravo.playAttack(brutalAssaultBlue);

    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: at the start of your turn, banish 2 GY copies and gain {r}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6, intellect: 0 },
      {
        hero: bravo,
        hand: [],
        graveyard: [dracoFireRed, dracoFireRed],
        deck: 6,
        intellect: 0,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).endTurn();
    game.untilIdle({ optionals: "accept", entityTargets: "maximum", ordering: "listed" });

    expect(Bravo.zone("banished")).toHaveLength(2);
    expect(Bravo.zone("graveyard")).toHaveLength(0);
    expectFabPlayer(Bravo).toHaveResourceCount(1);
  });
});
