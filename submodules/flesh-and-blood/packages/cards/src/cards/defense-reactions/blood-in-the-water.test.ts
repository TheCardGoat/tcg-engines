import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { barnacleYellow } from "../actions/barnacle.ts";
import { dash } from "../heroes/dash.ts";
import { ragingOnslaughtRed } from "../actions/raging-onslaught.ts";
import { snatchRed } from "../actions/snatch.ts";
import { bloodInTheWaterRed } from "./blood-in-the-water.ts";

/**
 * Blood in the Water Red (SEA047) — Pirate Necromancer Defense Reaction, 3{d}.
 *
 * Printed: When this defends, you may discard a card or destroy the top card
 * of your deck. If that card has watery grave, this gets +2{d}.
 */

describe("Blood in the Water (SEA047) AAA", () => {
  it("happy: discarding a watery-grave card gives +2 defense", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [ragingOnslaughtRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: gravyBones,
        hand: [bloodInTheWaterRed, barnacleYellow],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Gravy = game.as(gravyBones);

    Dash.attackWith(ragingOnslaughtRed);
    game.toReaction("defender");
    // The optional is accepted, the discard option chosen, and Barnacle
    // (watery grave) named as the discard.
    Gravy.must.playReaction(bloodInTheWaterRed);
    game.passBoth();
    game.passBoth();
    Gravy.accept();
    Gravy.choose("discard");
    Gravy.target(barnacleYellow);
    game.helpers.resolveRestOfCombat();

    // Barnacle's watery grave lifts the block to 5{d}, eating the 6-power
    // swing down to 1.
    expectFabPlayer(Gravy).toHaveLife(19);
    expectFabCard(Gravy, barnacleYellow).toBeIn("graveyard");
  });

  it("boundary: discarding a card without watery grave does not add defense", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [ragingOnslaughtRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: gravyBones,
        hand: [bloodInTheWaterRed, snatchRed],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Gravy = game.as(gravyBones);

    Dash.attackWith(ragingOnslaughtRed);
    game.toReaction("defender");
    Gravy.must.playReaction(bloodInTheWaterRed);
    game.passBoth();
    game.passBoth();
    Gravy.accept();
    Gravy.choose("discard");
    Gravy.target(snatchRed);
    game.helpers.resolveRestOfCombat();

    // Snatch has no watery grave: printed 3{d} only, 3 damage through.
    expectFabPlayer(Gravy).toHaveLife(17);
    expectFabCard(Gravy, snatchRed).toBeIn("graveyard");
  });
});
