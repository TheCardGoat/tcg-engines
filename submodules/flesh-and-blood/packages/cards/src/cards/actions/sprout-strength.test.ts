import { describe, expect, it } from "vitest";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { briar } from "../heroes/briar.ts";
import { dash } from "../heroes/dash.ts";
import { sproutStrengthRed } from "./sprout-strength.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

// sprout-strength-red (PEN222) — Earth Action, cost 0, go again.
// Printed text carries THREE "Your next attack this turn gets +1{p}." entries (PEN222-a1/a2/a3).
// All three resolve on the same next attack, so the cumulative buff is +3{p}.
describe("Sprout Strength family AAA", () => {
  it("happy: the next attack gains the cumulative +3{p} (three stacking instances)", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [sproutStrengthRed, brutalAssaultBlue],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      manual,
    );
    const Briar = game.as(briar);

    Briar.play(sproutStrengthRed);
    game.helpers.resolveUntilIdle();
    Briar.attackWith(brutalAssaultBlue);
    // Brutal Assault base power 4 + 3 (one +1{p} per printed instance) = 7.
    expect(game.combat()?.activeLink?.attackPower).toBe(7);
  });

  it("boundary: without Sprout Strength the attack stays at its printed base power", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [brutalAssaultBlue],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      manual,
    );
    const Briar = game.as(briar);

    Briar.attackWith(brutalAssaultBlue);
    // No Sprout Strength played -> base power 4.
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
  });

  it("timing: go again refunds the action point spent to play Sprout Strength", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [sproutStrengthRed],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      manual,
    );
    const Briar = game.as(briar);

    expect(Briar.actionPoints()).toBe(1);
    Briar.play(sproutStrengthRed);
    game.helpers.resolveUntilIdle();
    // -1 AP to play the Action, +1 AP from go again = still 1.
    expect(Briar.actionPoints()).toBe(1);
  });
});
