import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  fabToken,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { knickKnackBricABracRed } from "../actions/knick-knack-bric-a-brac.ts";
import { goldenGalea } from "./golden-galea.ts";

/**
 * Golden Galea (SUP247) — Equipment - Head. (Legendary, Temper)
 * Printed: "This counts as a Gold."
 * Observable: Knick Knack Bric-a-brac's destroy-Gold additional cost can
 * destroy the equipment as though it were a Gold token.
 */

void fabToken;

describe("Golden Galea (SUP247) AAA", () => {
  it("happy: a destroy-Gold cost can destroy this as though it were a Gold", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        head: [goldenGalea],
        hand: [knickKnackBricABracRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.playInstance(Dash.id, Dash.findCardInZone("hand", knickKnackBricABracRed), {}, "explicit");
    Dash.accept();
    Dash.target(goldenGalea);
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, goldenGalea).toBeIn("graveyard");
  });

  it("boundary: declining the cost leaves this seated", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        head: [goldenGalea],
        hand: [knickKnackBricABracRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.playInstance(Dash.id, Dash.findCardInZone("hand", knickKnackBricABracRed), {}, "explicit");
    Dash.decline();
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, goldenGalea).toBeIn("head");
  });

  it("timing: destroyed as a Gold, its slot frees within the same turn", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        head: [goldenGalea],
        hand: [knickKnackBricABracRed, snatchRed],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.playInstance(Dash.id, Dash.findCardInZone("hand", knickKnackBricABracRed), {}, "explicit");
    Dash.accept();
    Dash.target(goldenGalea);
    game.helpers.resolveUntilIdle();

    expect(Dash.zone("head")).toHaveLength(0);
    expectFabCard(Dash, knickKnackBricABracRed).toBeIn("graveyard");
  });
});
