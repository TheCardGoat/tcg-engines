import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { riptideLurkerOfTheDeep } from "../heroes/riptide-lurker-of-the-deep.ts";
import { deathDealer } from "../weapons/death-dealer.ts";
import { sleepDartRed } from "./sleep-dart.ts";

/**
 * Sleep Dart Red (CRU132) — Ranger Arrow Attack.
 *
 * Printed: If Sleep Dart hits a hero, they lose all hero card effects and
 * activated abilities until the end of their next turn.
 */

describe("Sleep Dart (CRU132) AAA", () => {
  it("happy: the arrow hits and lands for its printed damage", () => {
    const game = FabTestEngine.start(
      {
        hero: riptideLurkerOfTheDeep,
        weapon1: [deathDealer],
        arsenal: [sleepDartRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Riptide = game.as(riptideLurkerOfTheDeep);
    const Bravo = game.as(bravo);

    Riptide.attackWith(sleepDartRed, { from: "arsenal" });
    Bravo.defendWith();
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Bravo).toHaveLife(15); // 20 - 5
  });
});
