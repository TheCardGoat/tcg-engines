import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { deathDealer } from "../weapons/death-dealer.ts";
import { lexi } from "../heroes/lexi.ts";
import { frazzleRed } from "./frazzle.ts";
import { weaveLightningRed } from "./weave-lightning.ts";

/**
 * Frazzle Red (ELE059) — Elemental Ranger Arrow Attack.
 *
 * Printed: Lightning Fusion
 * If Frazzle was fused, whenever an attack would deal damage this turn,
 * instead it deals that much damage plus 1.
 */

describe("Frazzle (ELE059) AAA", () => {
  it("happy: fused Frazzle's own attack deals printed damage plus 1", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        weapon1: [deathDealer],
        arsenal: [frazzleRed],
        hand: [weaveLightningRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Lexi = game.as(lexi);
    const Dash = game.as(dash);

    Lexi.attackWith(frazzleRed, {
      from: "arsenal",
      fuse: true,
      fuseCards: [weaveLightningRed],
    });
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(14); // 20 - (5 + 1)
    expectFabCard(Lexi, weaveLightningRed).toBeIn("hand");
  });

  it("boundary: unfused Frazzle deals its printed damage", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        weapon1: [deathDealer],
        arsenal: [frazzleRed],
        hand: [weaveLightningRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Lexi = game.as(lexi);
    const Dash = game.as(dash);

    Lexi.attackWith(frazzleRed, { from: "arsenal" });
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(15); // 20 - 5
  });
});
