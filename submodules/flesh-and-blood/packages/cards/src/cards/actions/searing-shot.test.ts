import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { azalea } from "../heroes/azalea.ts";
import { deathDealer } from "../weapons/death-dealer.ts";
import { searingShotRed } from "./searing-shot.ts";

/**
 * Searing Shot Red (ARC069) — Ranger Arrow Attack.
 *
 * Printed: If Searing Shot hits a hero, they lose 1{h}.
 */

describe("Searing Shot (ARC069) AAA", () => {
  it("happy: an unblocked hit deals power damage plus the 1{h} loss", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [searingShotRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Bravo = game.as(bravo);

    Azalea.attackWith(searingShotRed, { from: "arsenal" });
    Bravo.defendWith();
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Bravo).toHaveLife(15); // 20 - 4 - 1 rider
  });
});
