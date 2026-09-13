import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { azalea } from "../heroes/azalea.ts";
import { salvageShotRed } from "../actions/salvage-shot.ts";
import { searingShotRed } from "../actions/searing-shot.ts";
import { sandscourGreatbow } from "./sandscour-greatbow.ts";

/**
 * Sandscour Greatbow (DYN151) — Ranger Weapon - Bow (2H).
 *
 * Printed:
 *   Once per Turn Action - {r}: Look at the top card of your deck. You may put
 *   an arrow from your hand or the top of your deck face up into your arsenal.
 *   Go again
 *   Whenever an arrow is put face up in arsenal from your deck, put an aim
 *   counter on it.
 */

describe("Sandscour Greatbow (DYN151) AAA", () => {
  it("happy: the deck-top arrow is hoarded face up and gains an aim counter", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [sandscourGreatbow],
        deckTop: [salvageShotRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.activate(sandscourGreatbow);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    expectFabCard(Azalea, salvageShotRed).toBeIn("arsenal");
    expectFabCard(Azalea, salvageShotRed).toHaveCounters(1, "aim");
    expectFabPlayer(Azalea).toHaveAP(1);
  });

  it("boundary: declining the optional leaves the arsenal empty", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [sandscourGreatbow],
        deckTop: [salvageShotRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.activate(sandscourGreatbow);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expect(Azalea.zone("arsenal")).toHaveLength(0);
  });

  it("timing: an arrow hoarded from hand enters face up but gains no aim counter", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [sandscourGreatbow],
        hand: [searingShotRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.activate(sandscourGreatbow);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    expectFabCard(Azalea, searingShotRed).toBeIn("arsenal");
    expectFabCard(Azalea, searingShotRed).toHaveCounters(0, "aim");
  });
});
