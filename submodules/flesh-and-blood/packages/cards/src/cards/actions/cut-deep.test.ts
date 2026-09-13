import { describe, expect, it } from "vitest";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { boltyn } from "../heroes/boltyn.ts";
import { dash } from "../heroes/dash.ts";
import { cutDeepRed } from "./cut-deep.ts";
import { quicksilverDagger } from "../weapons/quicksilver-dagger.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

// cut-deep-red (HNT128) — Warrior Action, cost 0, go again.
// Printed: "Your next dagger attack this turn gets +4{p}."
// No Warrior-playable Dagger attack-action card exists in the catalog (the only one,
// kiss-of-death-red, is Assassin-only), so the recipient is a weapon attack:
// Quicksilver Dagger (DYN069), a Warrior Dagger (1H) weapon with printed power 1.
describe("cut-deep family AAA", () => {
  it("happy: the next dagger attack (weapon) gains +4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        weapon1: [quicksilverDagger],
        hand: [cutDeepRed],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      manual,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.play(cutDeepRed);
    game.helpers.resolveUntilIdle();
    // Declare the dagger weapon attack; it should consume the +4 buff on declaration.
    Boltyn.activate(quicksilverDagger);
    game.passBoth();

    // Quicksilver Dagger base power 1 + 4 from Cut Deep = 5.
    expect(game.combat()?.activeLink?.attackPower).toBe(5);
  });

  it("boundary: a non-dagger attack gets no buff", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [cutDeepRed, brutalAssaultBlue],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      manual,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.play(cutDeepRed);
    game.helpers.resolveUntilIdle();
    // Brutal Assault is a Generic Action Attack (not a Dagger) — it must NOT get +4.
    Boltyn.attackWith(brutalAssaultBlue);

    // Brutal Assault base power 4, untouched by the dagger-only Cut Deep buff.
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
  });

  it("timing: go again refunds the action point spent to play Cut Deep", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [cutDeepRed],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      manual,
    );
    const Boltyn = game.as(boltyn);

    expect(Boltyn.actionPoints()).toBe(1);
    Boltyn.play(cutDeepRed);
    game.helpers.resolveUntilIdle();
    // −1 AP to play the Action, +1 AP from go again = still 1 (enables the follow-up dagger attack).
    expect(Boltyn.actionPoints()).toBe(1);
  });
});
