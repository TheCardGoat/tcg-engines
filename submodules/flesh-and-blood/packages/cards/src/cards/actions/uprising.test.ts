import { describe, expect, it } from "vitest";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fai } from "../heroes/fai.ts";
import { blazeHeadlongRed } from "./blaze-headlong.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { uprisingRed } from "./uprising.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

// uprising-red (UPR088) — Draconic Action, cost 0, go again.
// Printed: "Your next 4 Draconic attacks this turn gain +1{p}."
// The appliesTo.count:4 multi-buff is exercised by chaining two Draconic
// attacks: both the 1st and the 2nd must gain +1 (count > 1).
describe("uprising-red (UPR088) AAA", () => {
  it("happy: the next Draconic attacks each gain +1{p} (multi-attack count 4)", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [uprisingRed, blazeHeadlongRed, blazeHeadlongRed],
        resourcePoints: 6,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      manual,
    );
    const Fai = game.as(fai);

    Fai.play(uprisingRed);
    game.helpers.resolveUntilIdle();

    // 1st Draconic attack this turn.
    Fai.attackWith(blazeHeadlongRed);
    // Blaze Headlong base power 4 + 1 from Uprising = 5.
    expect(game.combat()?.activeLink?.attackPower).toBe(5);
    game.helpers.resolveRestOfCombat();

    // 2nd Draconic attack this turn — still buffed (count > 1 remaining).
    Fai.attackWith(blazeHeadlongRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(5);
  });

  it("boundary: a non-Draconic attack gets NO buff", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [uprisingRed, brutalAssaultBlue],
        resourcePoints: 6,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      manual,
    );
    const Fai = game.as(fai);

    Fai.play(uprisingRed);
    game.helpers.resolveUntilIdle();
    Fai.attackWith(brutalAssaultBlue);
    // Brutal Assault is Generic (not Draconic) -> supertype filter does not match -> base 4.
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
  });

  it("timing: go again refunds the action point spent to play Uprising", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [uprisingRed],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      manual,
    );
    const Fai = game.as(fai);

    expect(Fai.actionPoints()).toBe(1);
    Fai.play(uprisingRed);
    game.helpers.resolveUntilIdle();
    // −1 AP to play the Action, +1 AP from go again = still 1.
    expect(Fai.actionPoints()).toBe(1);
  });
});
