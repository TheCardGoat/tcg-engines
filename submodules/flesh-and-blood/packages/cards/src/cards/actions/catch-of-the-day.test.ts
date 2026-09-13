import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { marlynn } from "../heroes/marlynn.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { deathDealer } from "../shared/test-recipients.ts";
import { blueFinHarpoonBlue } from "./blue-fin-harpoon.ts";
import { catchOfTheDayBlue } from "./catch-of-the-day.ts";

/**
 * Catch of the Day (SUP268) — Pirate Ranger Action, cost 0, 3{d}, go again.
 * Printed: "Your next arrow attack this turn gets +2{p}.
 * If a go fish effect would trigger this turn, instead it triggers twice.
 * Go again"
 */

describe("Catch of the Day (SUP268) AAA", () => {
  it("happy: the next arrow gets +2{p} and a Go Fish hit triggers twice", () => {
    const game = FabTestEngine.start(
      {
        hero: marlynn,
        hand: [catchOfTheDayBlue],
        weapon1: [deathDealer],
        arsenal: [{ card: blueFinHarpoonBlue, state: { faceDown: true } }],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue, nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Marlynn = game.as(marlynn);

    Marlynn.play(catchOfTheDayBlue);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Marlynn).toHaveAP(1);
    expectFabCard(Marlynn, catchOfTheDayBlue).toBeIn("graveyard");

    Marlynn.attackWith(blueFinHarpoonBlue, { from: "arsenal" });
    expectCombat(game).toHaveAttackPower(6);
    expect(() => game.closeCombat({ optionals: "decline", entityTargets: "minimum" })).toThrow(
      /ordering \(2 entries\)/,
    );
  });

  it("boundary: a non-arrow attack does not get +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: marlynn,
        hand: [catchOfTheDayBlue, snatchRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Marlynn = game.as(marlynn);

    Marlynn.play(catchOfTheDayBlue);
    game.helpers.resolveUntilIdle();
    Marlynn.attackWith(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: marlynn,
        hand: [catchOfTheDayBlue],
        life: 20,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Marlynn = game.as(marlynn);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Marlynn.defendWith([catchOfTheDayBlue]);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Marlynn).toHaveLife(19);
    expectFabCard(Marlynn, catchOfTheDayBlue).toBeIn("graveyard");
  });
});
