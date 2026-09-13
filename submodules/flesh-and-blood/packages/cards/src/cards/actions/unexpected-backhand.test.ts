import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { commandAndConquerRed } from "./command-and-conquer.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { nimblismBlue } from "./nimblism.ts";
import { vigorousSmashupBlue } from "./vigorous-smashup.ts";
import { unexpectedBackhandRed } from "./unexpected-backhand.ts";

/**
 * Unexpected Backhand (SUP161) — Brute Action Attack, 7{p}/3{d}.
 *
 * Printed: When you win a clash revealing this, deal 1 damage to the other hero.
 */

describe("Unexpected Backhand (SUP161) AAA", () => {
  it("happy: winning a clash revealing this deals 1 damage to the other hero", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        life: 20,
        deck: [nimblismBlue],
      },
      {
        hero: rhinar,
        hand: [vigorousSmashupBlue],
        deck: [unexpectedBackhandRed],
        life: 20,
      },
      FAB_MANUAL_HARNESS,
    );

    game.as(dash).attackWith(brutalAssaultBlue);
    game.advanceCombatTo("defend");
    game.as(rhinar).defendWith(vigorousSmashupBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabPlayer(game.as(dash)).toHaveLife(19);
  });

  it("boundary: winning a clash revealing a different card does not deal Backhand damage", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        life: 20,
        deck: [nimblismBlue],
      },
      {
        hero: rhinar,
        hand: [vigorousSmashupBlue],
        deck: [commandAndConquerRed],
        life: 20,
      },
      FAB_MANUAL_HARNESS,
    );

    game.as(dash).attackWith(brutalAssaultBlue);
    game.advanceCombatTo("defend");
    game.as(rhinar).defendWith(vigorousSmashupBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabPlayer(game.as(dash)).toHaveLife(20);
  });
});
