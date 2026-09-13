import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultRed } from "../actions/brutal-assault.ts";
import { fishFingers } from "./fish-fingers.ts";

/**
 * Fish Fingers (SEA128) — Pirate Arms d1 Blade Break.
 *
 * Printed: Action - {r}, destroy this: Your next attack this turn gets +1{p}.
 * Go again
 *
 * Silken Gi family golden: the destroyed arms buff the next attack only
 * (power +1, no cost change).
 */

describe("Fish Fingers (SEA128) AAA", () => {
  it("happy: destroy the arms so the next attack gets +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [fishFingers],
        hand: [brutalAssaultRed],
        actionPoints: 1,
        resourcePoints: 3,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.activate(fishFingers);
    game.helpers.resolveUntilIdle();
    expectFabCard(Bravo, fishFingers).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveAP(1);

    Bravo.playAttack(brutalAssaultRed);
    expectCombat(game).toHaveAttackPower(7);
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(13);
    expectFabPlayer(Bravo).toHaveResourceCount(0);
  });

  it("boundary: without the arms the same attack stays printed 6{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [brutalAssaultRed],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(brutalAssaultRed);
    expectCombat(game).toHaveAttackPower(6);
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(14);
  });

  it("timing: only the next attack this turn gets +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [fishFingers],
        hand: [brutalAssaultRed, brutalAssaultRed],
        actionPoints: 2,
        resourcePoints: 5,
        deck: 6,
      },
      { hero: dash, life: 40, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.activate(fishFingers);
    game.helpers.resolveUntilIdle();
    Bravo.playAttack(brutalAssaultRed);
    expectCombat(game).toHaveAttackPower(7);
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();

    Bravo.playAttack(brutalAssaultRed);
    expectCombat(game).toHaveAttackPower(6);
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(27);
  });
});
