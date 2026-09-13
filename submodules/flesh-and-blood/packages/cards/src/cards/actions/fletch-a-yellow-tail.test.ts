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
import { deathDealer, headShotYellow, searingShotRed } from "../shared/test-recipients.ts";
import { fletchAYellowTailYellow } from "./fletch-a-yellow-tail.ts";

/**
 * Fletch a Yellow Tail (OUT110) — Ranger Action, yellow.
 *
 * Printed: Your next arrow attack this turn gains +3{p}. If it has an aim
 * counter, it gains "Yellow cards have -1{d} while defending this." Go again
 */

describe("Fletch a Yellow Tail (OUT110) AAA", () => {
  it("happy: the next arrow attack this turn gains +3{p} and go again refunds the AP", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [fletchAYellowTailYellow],
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

    Azalea.play(fletchAYellowTailYellow);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Azalea).toHaveAP(1);

    Azalea.attackWith(searingShotRed, { from: "arsenal" });
    // Searing Shot base 4 + 3 = 7.
    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: a non-arrow attack played after Fletch a Yellow Tail gets no +3", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [fletchAYellowTailYellow, snatchRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.play(fletchAYellowTailYellow);
    game.helpers.resolveUntilIdle();

    Azalea.attackWith(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: an aimed arrow gives Yellow defenders -1{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [fletchAYellowTailYellow],
        weapon1: [deathDealer],
        arsenal: [{ card: rustyHarpoonBlue, state: { aimCounters: 1 } }],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [headShotYellow], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.play(fletchAYellowTailYellow);
    game.helpers.resolveUntilIdle();

    Azalea.attackWith(rustyHarpoonBlue, { from: "arsenal" });
    game.advanceCombatTo("defend");
    // Rusty Harpoon base 1 + 3 = 4 (no on-hit lose-life to confound the block).
    expectCombat(game).toHaveAttackPower(4);

    Dash.defendWith([headShotYellow]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(18);
  });
});
