import { describe, expect, it } from "vitest";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { briar } from "../heroes/briar.ts";
import { dash } from "../heroes/dash.ts";
import { sizzleRed } from "./sizzle.ts";
import { fryRed } from "./fry.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { sizzleYellow } from "./sizzle.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

// sizzle-red (AUR014) — Lightning Action, cost 0, go again.
// Printed: "Your next Lightning or Elemental attack this turn gets +3{p}."
describe("sizzle-red (AUR014) AAA", () => {
  it("happy: the next Lightning attack gains +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [sizzleRed, fryRed],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      manual,
    );
    const Briar = game.as(briar);

    Briar.play(sizzleRed);
    game.helpers.resolveUntilIdle();
    Briar.attackWith(fryRed);
    // Fry base power 3 + 3 from Sizzle = 6.
    expect(game.combat()?.activeLink?.attackPower).toBe(6);
  });

  it("boundary: a non-Lightning/Elemental attack gets NO buff", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [sizzleRed, brutalAssaultBlue],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      manual,
    );
    const Briar = game.as(briar);

    Briar.play(sizzleRed);
    game.helpers.resolveUntilIdle();
    Briar.attackWith(brutalAssaultBlue);
    // Brutal Assault is Generic (not Lightning/Elemental) -> Sizzle filter does not match -> base 4.
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
  });

  it("timing: go again refunds the action point spent to play Sizzle", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [sizzleRed],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      manual,
    );
    const Briar = game.as(briar);

    expect(Briar.actionPoints()).toBe(1);
    Briar.play(sizzleRed);
    game.helpers.resolveUntilIdle();
    // -1 AP to play the Action, +1 AP from go again = still 1.
    expect(Briar.actionPoints()).toBe(1);
  });
});

// sizzle-yellow (AUR021) — Lightning Action, cost 0, go again.
// Printed: "Your next Lightning or Elemental attack this turn gets +2{p}."
describe("sizzle-yellow (AUR021) AAA", () => {
  it("happy: the next Lightning attack gains +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [sizzleYellow, fryRed],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      manual,
    );
    const Briar = game.as(briar);

    Briar.play(sizzleYellow);
    game.helpers.resolveUntilIdle();
    Briar.attackWith(fryRed);
    // Fry base power 3 + 2 from Sizzle = 5.
    expect(game.combat()?.activeLink?.attackPower).toBe(5);
  });

  it("boundary: a non-Lightning/Elemental attack gets NO buff", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [sizzleYellow, brutalAssaultBlue],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      manual,
    );
    const Briar = game.as(briar);

    Briar.play(sizzleYellow);
    game.helpers.resolveUntilIdle();
    Briar.attackWith(brutalAssaultBlue);
    // Brutal Assault is Generic (not Lightning/Elemental) -> Sizzle filter does not match -> base 4.
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
  });

  it("timing: go again refunds the action point spent to play Sizzle", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [sizzleYellow],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      manual,
    );
    const Briar = game.as(briar);

    expect(Briar.actionPoints()).toBe(1);
    Briar.play(sizzleYellow);
    game.helpers.resolveUntilIdle();
    // -1 AP to play the Action, +1 AP from go again = still 1.
    expect(Briar.actionPoints()).toBe(1);
  });
});
