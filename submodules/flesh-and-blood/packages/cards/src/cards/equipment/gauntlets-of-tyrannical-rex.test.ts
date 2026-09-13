import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { alphaRampageRed } from "../actions/alpha-rampage.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { gauntletsOfTyrannicalRex } from "./gauntlets-of-tyrannical-rex.ts";

describe("Gauntlets of Tyrannical Rex (SUP125) AAA", () => {
  it("happy: with a 6+{p} card in pitch, the next attack this turn gets +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        arms: [gauntletsOfTyrannicalRex],
        hand: [snatchRed],
        pitch: [alphaRampageRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.activate(gauntletsOfTyrannicalRex);
    game.passBoth();
    expectFabCard(Rhinar, gauntletsOfTyrannicalRex).toBeTapped();
    expectFabPlayer(Rhinar).toHaveAP(2);

    Rhinar.attackWith(snatchRed);

    expect(game.combat()?.open).toBe(true);
    expect(game.combat()?.activeLink?.attackPower).toBe(5);
  });

  it("boundary: without a 6+{p} card in pitch the activation is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        arms: [gauntletsOfTyrannicalRex],
        pitch: [nimblismBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );

    game.as(rhinar).expectActivationRejected(gauntletsOfTyrannicalRex);
    expectFabCard(game.as(rhinar), gauntletsOfTyrannicalRex).toBeReady();
  });

  it("timing: Temper — first defend applies −1{d} and stays equipped", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: rhinar,
        life: 20,
        arms: [gauntletsOfTyrannicalRex],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    expectFabCard(Rhinar, gauntletsOfTyrannicalRex).toHaveKeyword("temper");

    game.as(dash).attackWith(snatchRed);
    Rhinar.defendWith(gauntletsOfTyrannicalRex);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Rhinar, gauntletsOfTyrannicalRex).toBeIn("arms");
    expectFabCard(Rhinar, gauntletsOfTyrannicalRex).toHaveDefenseCounters(-1);
  });
});
