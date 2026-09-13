import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { chane } from "../heroes/chane.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { boundingDemigonBlue } from "./bounding-demigon.ts";
import { otherworldlySinsYellow } from "./otherworldly-sins.ts";

/**
 * Otherworldly Sins (yellow) — Shadow Runeblade Action, cost 1, go again.
 *
 * Printed: "Your next Runeblade or Shadow attack this turn gets +2{p}.\nCreate
 * a Runechant token.\nGo again"
 */

describe("Otherworldly Sins (IAR142) AAA", () => {
  it("happy: the Runeblade attack gets +2{p} and a Runechant token is created", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [otherworldlySinsYellow, boundingDemigonBlue],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.play(otherworldlySinsYellow);
    game.untilIdle();
    expectFabPlayer(Chane).toHaveTokenCount("runechant", 1);

    Chane.playAttack(boundingDemigonBlue);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(3); // 1 base + printed +2
    game.closeCombat();

    // 3 combat damage plus the live Runechant's 1 arcane ping.
    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });

  it("boundary: a plain Generic attack gets neither the +2 nor consumes the latch", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [otherworldlySinsYellow, brutalAssaultBlue],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.play(otherworldlySinsYellow);
    game.untilIdle();

    Chane.playAttack(brutalAssaultBlue);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(4); // unmodified brutal assault
    game.closeCombat();
    // 4 combat damage plus the live Runechant's 1 arcane ping.
    expectFabPlayer(game.as(dash)).toHaveLife(15);
  });
});
