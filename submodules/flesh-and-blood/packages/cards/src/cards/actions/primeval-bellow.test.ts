import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { nimblismBlue } from "./nimblism.ts";
import { packHuntBlue } from "./pack-hunt.ts";
import { primevalBellowRed } from "./primeval-bellow.ts";

describe("Primeval Bellow family AAA", () => {
  it("happy: the red member gives the next Brute attack +5{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [primevalBellowRed, packHuntBlue, packHuntBlue, nimblismBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.play(primevalBellowRed);
    game.untilIdle();
    Rhinar.playAttack(packHuntBlue);

    expectCombat(game).toHaveAttackPower(9);
  });

  it("boundary: the next non-Brute attack is not buffed", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [primevalBellowRed, brutalAssaultBlue, brutalAssaultBlue, nimblismBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.play(primevalBellowRed);
    game.untilIdle();
    Rhinar.playAttack(brutalAssaultBlue);

    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: Go again refunds the action point spent on Primeval Bellow", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [primevalBellowRed, nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.play(primevalBellowRed);
    game.untilIdle();

    expectFabPlayer(Rhinar).toHaveAP(1);
  });
});
