import { describe, expect, it } from "vitest";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { overswingRed } from "./overswing.ts";
import { clashOfMightBlue } from "./clash-of-might.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

// overswing-red (MPG091) — Guardian Action, cost 2, go again (heave 2).
// Printed: "The next Guardian attack action card you play this turn gets +3{p}."
describe("overswing family AAA", () => {
  it("happy: the next Guardian attack action card gains +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [overswingRed, clashOfMightBlue],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      manual,
    );
    const Bravo = game.as(bravo);

    Bravo.play(overswingRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    Bravo.attackWith(clashOfMightBlue);
    // Clash of Might base power 4 + 3 from Overswing = 7.
    expect(game.combat()?.activeLink?.attackPower).toBe(7);
  });

  it("boundary: a non-Guardian attack gets NO buff", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [overswingRed, brutalAssaultBlue],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      manual,
    );
    const Bravo = game.as(bravo);

    Bravo.play(overswingRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    Bravo.attackWith(brutalAssaultBlue);
    // Brutal Assault is Generic (not Guardian) — buff does not apply: base power 4.
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
  });

  it("timing: go again refunds the action point spent to play Overswing", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [overswingRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      manual,
    );
    const Bravo = game.as(bravo);

    expect(Bravo.actionPoints()).toBe(1);
    Bravo.play(overswingRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    // −1 AP to play the Action, +1 AP from go again = still 1 (enables the follow-up attack).
    expect(Bravo.actionPoints()).toBe(1);
  });
});
