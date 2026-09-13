import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { rhinar } from "../heroes/rhinar.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { savageSwingRed } from "./savage-swing.ts";

/**
 * Savage Swing, Red (RNR011) — Brute Attack Action.
 *
 * Printed: "As an additional cost to play Savage Swing, discard a random card."
 * (cost 1, 7{p}, 3{d})
 */

describe("Savage Swing (RNR011) AAA", () => {
  it("happy: the additional random discard pays and this attacks for 7", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [savageSwingRed, nimblismBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6, hand: [] },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.attackWith(savageSwingRed);
    expectCombat(game).toHaveAttackPower(7);
    expectFabCard(Rhinar, nimblismBlue).toBeIn("graveyard");
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(13);
    expectFabCard(Rhinar, savageSwingRed).toBeIn("graveyard");
  });

  it("boundary: without another card to discard this cannot be played", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [savageSwingRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6, hand: [] },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    expect(() => Rhinar.attackWith(savageSwingRed)).toThrow();
    expectFabCard(Rhinar, savageSwingRed).toBeIn("hand");
  });

  it("timing: the discarded card remains in the graveyard after combat closes", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [savageSwingRed, nimblismBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6, hand: [] },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.attackWith(savageSwingRed);
    game.helpers.resolveRestOfCombat();
    expectFabCard(Rhinar, nimblismBlue).toBeIn("graveyard");
  });
});
