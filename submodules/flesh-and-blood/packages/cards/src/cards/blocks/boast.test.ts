import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { clashOfMightBlue } from "../actions/clash-of-might.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { wreckerRompRed } from "../actions/wrecker-romp.ts";
import { snatchRed } from "../actions/snatch.ts";
import { boastBlue } from "./boast.ts";

/**
 * Boast (HVY060) — "+X{d} while defending, where X is twice the number of
 * clashes you've won this turn." Printed 3{d}.
 */

describe("Boast (HVY060) AAA", () => {
  it("happy: one clash win this turn makes Boast 5{d} vs 4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed, snatchRed],
        actionPoints: 2,
        deck: [nimblismBlue],
      },
      {
        hero: bravo,
        life: 20,
        hand: [clashOfMightBlue, boastBlue],
        deck: [wreckerRompRed],
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(snatchRed);
    Bravo.defendWith(clashOfMightBlue);
    game.untilIdle({ optionals: "decline", ordering: "listed" });
    expectFabPlayer(Bravo).toHaveTokenCount("might", 1);

    Dash.playAttack(snatchRed);
    Bravo.defendWith(boastBlue);
    game.helpers.resolveRestOfCombat();
    // First Snatch dealt 1 into Clash of Might 3{d}; Boast is 3+2=5{d} vs 4{p}.
    expectFabPlayer(Bravo).toHaveLife(19);
  });

  it("boundary: with no clash wins Boast stays 3{d} vs 4{p}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, life: 20, hand: [boastBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).playAttack(snatchRed);
    Bravo.defendWith(boastBlue);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Bravo).toHaveLife(19); // 20 - (4 - 3)
  });

  it("timing: a lost clash does not raise Boast", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed, snatchRed],
        actionPoints: 2,
        deck: [wreckerRompRed],
      },
      {
        hero: bravo,
        life: 20,
        hand: [clashOfMightBlue, boastBlue],
        deck: [nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(snatchRed);
    Bravo.defendWith(clashOfMightBlue);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    Dash.playAttack(snatchRed);
    Bravo.defendWith(boastBlue);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Bravo).toHaveLife(18);
  });
});
