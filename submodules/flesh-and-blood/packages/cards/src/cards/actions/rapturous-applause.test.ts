import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { vigorousSmashupBlue } from "./vigorous-smashup.ts";
import { wreckerRompRed } from "./wrecker-romp.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { commandAndConquerRed } from "./command-and-conquer.ts";
import { nimblismBlue } from "./nimblism.ts";
import { tuffnut } from "../heroes/tuffnut.ts";
import { rapturousApplauseRed } from "./rapturous-applause.ts";

/**
 * Rapturous Applause, Red (SUP043) — Revered Action - Attack, cost 3, 7{p}, 3{d}.
 * Printed: "When you win a clash revealing this, the crowd cheers you."
 *
 * Clash is CR 8.5.45. Crowd cheers is CR 8.5.57, observed end-to-end by
 * Tuffnut (SUP002) minting a Toughness token.
 */

describe("Rapturous Applause family AAA", () => {
  it("happy: winning a clash revealing this cheers you (Tuffnut mints Toughness)", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: [nimblismBlue],
      },
      {
        hero: tuffnut,
        hand: [vigorousSmashupBlue],
        deck: [rapturousApplauseRed],
      },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    game.as(dash).playAttack(brutalAssaultBlue);
    Tuffnut.defendWith(vigorousSmashupBlue);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Tuffnut).toHaveTokenCount("toughness", 1);
    expect(Tuffnut.zone("arena")).toContain("token:vigor");
    expect(game.as(dash).zone("arena")).not.toContain("token:toughness");
  });

  it("boundary: losing a clash revealing this does not cheer", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: [wreckerRompRed],
      },
      {
        hero: tuffnut,
        hand: [vigorousSmashupBlue],
        deck: [rapturousApplauseRed],
      },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    game.as(dash).playAttack(brutalAssaultBlue);
    Tuffnut.defendWith(vigorousSmashupBlue);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    // CR 8.5.45a: Dash won by revealing Wrecker Romp 8{p}. Tuffnut revealed
    // this 7{p} and lost, so the crowd does not cheer Tuffnut.
    expect(game.as(dash).zone("arena")).toContain("token:vigor");
    expectFabPlayer(Tuffnut).toHaveTokenCount("toughness", 0);
  });

  it("boundary: winning a clash revealing a different card does not cheer", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: [nimblismBlue],
      },
      {
        hero: tuffnut,
        hand: [vigorousSmashupBlue],
        deck: [commandAndConquerRed],
      },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    game.as(dash).playAttack(brutalAssaultBlue);
    Tuffnut.defendWith(vigorousSmashupBlue);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expect(Tuffnut.zone("arena")).toContain("token:vigor");
    expectFabPlayer(Tuffnut).toHaveTokenCount("toughness", 0);
  });

  it("timing: playing this as an attack does not cheer (clash-win only)", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [rapturousApplauseRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    Tuffnut.playAttack(rapturousApplauseRed);
    expectCombat(game).toHaveAttackPower(7);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(game.as(dash)).toHaveLife(13);
    expectFabPlayer(Tuffnut).toHaveTokenCount("toughness", 0);
  });
});
