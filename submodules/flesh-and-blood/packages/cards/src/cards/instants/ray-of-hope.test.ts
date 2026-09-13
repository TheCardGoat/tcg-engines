import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { boltyn } from "../heroes/boltyn.ts";
import { chane } from "../heroes/chane.ts";
import { snatchRed } from "../actions/snatch.ts";
import { rayOfHopeYellow } from "./ray-of-hope.ts";

/**
 * Ray of Hope (MON087) — Light Instant, cost 1.
 *
 * Printed: "Attacks you control have +1{p} while attacking a Shadow hero
 * this turn.
 * If you have less {h} than an opposing Shadow hero, put Ray of Hope into
 * your hero's soul."
 */

describe("Ray of Hope (MON087) AAA", () => {
  it("happy: vs a Shadow hero at higher life, this goes to soul and the attack gets +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [snatchRed, rayOfHopeYellow],
        resourcePoints: 1,
        actionPoints: 1,
        life: 19,
        deck: 6,
      },
      { hero: chane, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);
    const Chane = game.as(chane);

    Boltyn.playAttack(snatchRed);
    Chane.pass();
    Boltyn.play(rayOfHopeYellow);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(5);
    expectFabCard(Boltyn, rayOfHopeYellow).toBeIn("soul");
  });

  it("boundary: vs a non-Shadow hero this does not go to soul and the attack stays printed", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [snatchRed, rayOfHopeYellow],
        resourcePoints: 1,
        actionPoints: 1,
        life: 19,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);
    const Dash = game.as(dash);

    Boltyn.playAttack(snatchRed);
    Dash.pass();
    Boltyn.play(rayOfHopeYellow);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Boltyn, rayOfHopeYellow).toBeIn("graveyard");
  });

  it("timing: equal life vs a Shadow hero does not put this into soul", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [rayOfHopeYellow],
        resourcePoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: chane, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.play(rayOfHopeYellow);
    game.helpers.resolveUntilIdle();
    expectFabCard(Boltyn, rayOfHopeYellow).toBeIn("graveyard");
  });
});
