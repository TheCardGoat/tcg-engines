import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { wreckerRompRed } from "./wrecker-romp.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { rocktopBellowRed, rocktopBellowYellow } from "./rocktop-bellow.ts";

/**
 * Rocktop Bellow, Red — Brute Action, cost 2, 2{d}.
 *
 * Printed: "Reveal the top card of your deck. If the revealed card has 6 or
 * more base {p}, your next attack this turn gets overpower. Otherwise, put
 * the revealed card on the bottom. Your next attack this turn gets +4{p}.
 * Go again"
 */

describe("Rocktop Bellow AAA", () => {
  it("happy: revealing 6+ base {p} gives the next attack overpower and +4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [rocktopBellowRed, brutalAssaultBlue],
        resourcePoints: 4,
        actionPoints: 1,
        deckTop: [wreckerRompRed],
        deck: 6,
      },
      { hero: dash, hand: [snatchRed, nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);

    Rhinar.play(rocktopBellowRed);
    game.untilIdle();
    expectFabPlayer(Rhinar).toHaveAP(1);
    expect(Rhinar.zone("deck")).toContain(wreckerRompRed.canonicalId);

    Rhinar.playAttack(brutalAssaultBlue);
    expectCombat(game).toHaveAttackPower(8).toHaveKeyword("overpower");
    expect(() => Dash.defendWith([snatchRed, nimblismBlue])).toThrow();
    Dash.defendWith();
    game.closeCombat();
    expectFabPlayer(Dash).toHaveLife(12);
  });

  it("boundary: revealing a low-power card puts it on the bottom and the next attack is only +4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [rocktopBellowRed, brutalAssaultBlue],
        resourcePoints: 4,
        actionPoints: 1,
        deckTop: [nimblismBlue],
        deck: 6,
      },
      { hero: dash, hand: [snatchRed, nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);

    Rhinar.play(rocktopBellowRed);
    game.untilIdle();
    expectFabPlayer(Rhinar).toHaveAP(1);
    expect(Rhinar.zone("deck")[0]).toBe(nimblismBlue.canonicalId);

    Rhinar.playAttack(brutalAssaultBlue);
    expectCombat(game).toHaveAttackPower(8).notToHaveKeyword("overpower");
    Dash.defendWith([snatchRed, nimblismBlue]);
    game.closeCombat();
    expectFabPlayer(Dash).toHaveLife(16);
  });

  it("happy: yellow grants the printed +3{p} rather than the red +4", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [rocktopBellowYellow, brutalAssaultBlue],
        resourcePoints: 4,
        actionPoints: 1,
        deckTop: [nimblismBlue],
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.play(rocktopBellowYellow);
    game.untilIdle();
    expectFabPlayer(Rhinar).toHaveAP(1);

    Rhinar.playAttack(brutalAssaultBlue);
    expectCombat(game).toHaveAttackPower(7).notToHaveKeyword("overpower");
    game.closeCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(13);
  });
});
