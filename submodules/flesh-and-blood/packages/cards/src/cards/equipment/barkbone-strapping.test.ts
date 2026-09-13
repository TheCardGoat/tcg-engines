import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { kayo } from "../heroes/kayo.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { barkboneStrapping } from "./barkbone-strapping.ts";

/**
 * Barkbone Strapping (1HP008) — Brute Chest, Battleworn.
 * Printed: "Instant - Destroy this: Roll a 6 sided die. Gain {r} equal to
 * half the number rolled, rounded down."
 */

describe("Barkbone Strapping (1HP008) AAA", () => {
  it("happy: destroying this rolls a die and gains half its face, rounded down", () => {
    const game = FabTestEngine.start(
      {
        hero: kayo,
        chest: [barkboneStrapping],
        hand: [],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayo);

    Kayo.activate(barkboneStrapping);
    game.helpers.resolveUntilIdle();

    expectFabCard(Kayo, barkboneStrapping).toBeIn("graveyard");
    expectFabPlayer(Kayo).toHaveResourceCount(Math.floor(game.lastDieFace() / 2));
  });

  it("boundary: the destroyed strapping cannot be activated again", () => {
    const game = FabTestEngine.start(
      {
        hero: kayo,
        chest: [barkboneStrapping],
        hand: [],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayo);

    Kayo.activate(barkboneStrapping);
    game.helpers.resolveUntilIdle();
    Kayo.expectActivationRejected(barkboneStrapping);
    expectFabCard(Kayo, barkboneStrapping).toBeIn("graveyard");
  });

  it("timing: the Instant fires during the opponent's combat, before the damage lands", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: kayo, chest: [barkboneStrapping], hand: [], resourcePoints: 0, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayo);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Kayo.defendWith();
    game.toReaction("defender");
    Kayo.activate(barkboneStrapping);
    game.passBoth();
    game.helpers.resolveRestOfCombat();

    expectFabCard(Kayo, barkboneStrapping).toBeIn("graveyard");
    expectFabPlayer(Kayo).toHaveResourceCount(Math.floor(game.lastDieFace() / 2));
    expectFabPlayer(Kayo).toHaveLife(16);
  });
});
