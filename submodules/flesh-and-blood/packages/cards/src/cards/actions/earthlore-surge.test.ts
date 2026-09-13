import { describe, expect, it } from "vitest";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { briar } from "../heroes/briar.ts";
import { dash } from "../heroes/dash.ts";
import { earthloreSurgeRed } from "./earthlore-surge.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

// earthlore-surge-red (ELE137) — Earth Action, cost 2, go again.
// Printed: "The next attack action card you play this turn gains +5{p}."
describe("Earthlore Surge family AAA", () => {
  it("happy: the next attack action card gains +5{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [earthloreSurgeRed, brutalAssaultBlue],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      manual,
    );
    const Briar = game.as(briar);

    Briar.play(earthloreSurgeRed);
    game.helpers.resolveUntilIdle();
    Briar.attackWith(brutalAssaultBlue);
    // Brutal Assault base power 4 + 5 from Earthlore Surge = 9.
    expect(game.combat()?.activeLink?.attackPower).toBe(9);
  });

  it("boundary: without Earthlore Surge the attack is at its printed base power", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [brutalAssaultBlue], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      manual,
    );
    const Briar = game.as(briar);

    Briar.attackWith(brutalAssaultBlue);
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
  });

  it("timing: go again refunds the action point spent to play Earthlore Surge", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [earthloreSurgeRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      manual,
    );
    const Briar = game.as(briar);

    expect(Briar.actionPoints()).toBe(1);
    Briar.play(earthloreSurgeRed);
    game.helpers.resolveUntilIdle();
    // −1 AP to play the Action, +1 AP from go again = still 1.
    expect(Briar.actionPoints()).toBe(1);
  });
});
