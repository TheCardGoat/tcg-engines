import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { deathDealer } from "../weapons/death-dealer.ts";
import { riptideLurkerOfTheDeep } from "../heroes/riptide-lurker-of-the-deep.ts";
import { goldfinHarpoonYellow } from "./goldfin-harpoon.ts";

/**
 * Goldfin Harpoon Yellow (SEA093) — Pirate Ranger Arrow Attack.
 *
 * Printed: If this would be put into a graveyard, instead remove it from
 * the game.
 */

describe("Goldfin Harpoon (SEA093) AAA", () => {
  it("happy: the resolving arrow never reaches a graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: riptideLurkerOfTheDeep,
        weapon1: [deathDealer],
        arsenal: [goldfinHarpoonYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Riptide = game.as(riptideLurkerOfTheDeep);
    const Dash = game.as(dash);

    Riptide.attackWith(goldfinHarpoonYellow, { from: "arsenal" });
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(18); // 20 - 2
    // The engine encodes "remove it from the game" as the banished-zone
    // representation; the printed guarantee under test is that it never
    // reaches a graveyard.
    expect(Riptide.zone("graveyard")).not.toContain(goldfinHarpoonYellow.canonicalId);
    expect(Riptide.zone("banished")).toContain(goldfinHarpoonYellow.canonicalId);
  });
});
