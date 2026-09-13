import { describe, expect, it } from "vitest";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { ferventForerunnerRed } from "./fervent-forerunner.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { nuu } from "../heroes/nuu.ts";
import { firstTenetOfChiTideBlue } from "./first-tenet-of-chi-tide.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

// first-tenet-of-chi-tide-blue (MST093) — Mystic Action, cost 0, go again.
// Printed: "Your next blue attack this turn gets +2{p}."
// "blue" = a pitch-3 / blue-colored attack. The engine's color filter
// (appliesTo.next.color:["blue"]) matches a card whose color is blue.
describe("first-tenet-of-chi-tide-blue (MST093) AAA", () => {
  it("happy: the next blue attack gains +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: nuu,
        hand: [firstTenetOfChiTideBlue, brutalAssaultBlue],
        resourcePoints: 6,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      manual,
    );
    const Nuu = game.as(nuu);

    Nuu.play(firstTenetOfChiTideBlue);
    game.helpers.resolveUntilIdle();
    Nuu.attackWith(brutalAssaultBlue);
    // Brutal Assault (blue) base power 4 + 2 from First Tenet of Chi Tide = 6.
    expect(game.combat()?.activeLink?.attackPower).toBe(6);
  });

  it("boundary: a non-blue (red) attack gets NO buff", () => {
    const game = FabTestEngine.start(
      {
        hero: nuu,
        hand: [firstTenetOfChiTideBlue, ferventForerunnerRed],
        resourcePoints: 6,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      manual,
    );
    const Nuu = game.as(nuu);

    Nuu.play(firstTenetOfChiTideBlue);
    game.helpers.resolveUntilIdle();
    Nuu.attackWith(ferventForerunnerRed);
    // Fervent Forerunner is red (not blue) -> color filter does not match -> base 3.
    expect(game.combat()?.activeLink?.attackPower).toBe(3);
  });

  it("timing: go again refunds the action point spent to play First Tenet of Chi Tide", () => {
    const game = FabTestEngine.start(
      {
        hero: nuu,
        hand: [firstTenetOfChiTideBlue],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      manual,
    );
    const Nuu = game.as(nuu);

    expect(Nuu.actionPoints()).toBe(1);
    Nuu.play(firstTenetOfChiTideBlue);
    game.helpers.resolveUntilIdle();
    // −1 AP to play the Action, +1 AP from go again = still 1.
    expect(Nuu.actionPoints()).toBe(1);
  });
});
