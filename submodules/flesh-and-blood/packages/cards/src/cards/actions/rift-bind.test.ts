import { describe, it } from "vitest";
import {
  expectCombat,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { chane } from "../heroes/chane.ts";
import { nimblismBlue } from "./nimblism.ts";
import { riftBindRed } from "./rift-bind.ts";

describe("Rift Bind (CHN011) AAA", () => {
  it("happy: from banished after one non-attack action it is printed 3{p} plus X=1", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [nimblismBlue],
        banished: [riftBindRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.play(nimblismBlue);
    game.helpers.resolveUntilIdle();
    Chane.playAttack(riftBindRed, { from: "banished" });

    expectCombat(game).toHaveAttackPower(4);
  });

  it("boundary: from banished with no non-attack actions it stays printed 3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [],
        banished: [riftBindRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.playAttack(riftBindRed, { from: "banished" });

    expectCombat(game).toHaveAttackPower(3);
  });

  it("timing: from banished after two non-attack actions X is 2", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [nimblismBlue, nimblismBlue],
        banished: [riftBindRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.play(nimblismBlue);
    game.helpers.resolveUntilIdle();
    Chane.play(nimblismBlue);
    game.helpers.resolveUntilIdle();
    Chane.playAttack(riftBindRed, { from: "banished" });

    expectCombat(game).toHaveAttackPower(5);
  });
});
