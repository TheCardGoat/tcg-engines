import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { rustyHarpoonBlue } from "./rusty-harpoon.ts";
import { brutalAssaultBlue, deathDealer, searingShotRed } from "../shared/test-recipients.ts";
import { fletchABlueTailBlue } from "./fletch-a-blue-tail.ts";

/**
 * Fletch a Blue Tail (OUT111) — Ranger Action, blue.
 *
 * Printed: Your next arrow attack this turn gains +2{p}. If it has an aim
 * counter, it gains "Blue cards have -1{d} while defending this." Go again
 */

describe("Fletch a Blue Tail (OUT111) AAA", () => {
  it("happy: the next arrow attack this turn gains +2{p} and go again refunds the AP", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [fletchABlueTailBlue],
        weapon1: [deathDealer],
        arsenal: [{ card: searingShotRed, state: { faceDown: true } }],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.play(fletchABlueTailBlue);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Azalea).toHaveAP(1);

    Azalea.attackWith(searingShotRed, { from: "arsenal" });
    // Searing Shot base 4 + 2 = 6.
    expectCombat(game).toHaveAttackPower(6);
  });

  it("boundary: a non-arrow attack played after Fletch a Blue Tail gets no +2", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [fletchABlueTailBlue, snatchRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.play(fletchABlueTailBlue);
    game.helpers.resolveUntilIdle();

    Azalea.attackWith(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: an aimed arrow gives Blue defenders -1{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [fletchABlueTailBlue],
        weapon1: [deathDealer],
        arsenal: [{ card: rustyHarpoonBlue, state: { aimCounters: 1 } }],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [brutalAssaultBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.play(fletchABlueTailBlue);
    game.helpers.resolveUntilIdle();

    Azalea.attackWith(rustyHarpoonBlue, { from: "arsenal" });
    game.advanceCombatTo("defend");
    // Rusty Harpoon base 1 + 2 = 3 (no on-hit lose-life to confound the block).
    expectCombat(game).toHaveAttackPower(3);

    Dash.defendWith([brutalAssaultBlue]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(19);
  });
});
