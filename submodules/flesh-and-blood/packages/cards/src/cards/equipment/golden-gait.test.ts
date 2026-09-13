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
import { goldenGait } from "./golden-gait.ts";

/**
 * Golden Gait (SUP250) — Equipment - Legs. (Legendary, Temper)
 * Printed: "This counts as a Gold."
 * Observable: Knick Knack Bric-a-brac's destroy-Gold additional cost can
 * destroy the equipment as though it were a Gold token.
 */

void fabToken;

describe("Golden Gait (SUP250) AAA", () => {
  it("happy: a destroy-Gold cost can destroy this as though it were a Gold", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        legs: [goldenGait],
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
    Dash.target(goldenGait);
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, goldenGait).toBeIn("graveyard");
  });

  it("boundary: declining the cost leaves this seated", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        legs: [goldenGait],
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

    expectFabCard(Dash, goldenGait).toBeIn("legs");
  });

  it("timing: destroyed as a Gold, its slot frees within the same turn", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        legs: [goldenGait],
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
    Dash.target(goldenGait);
    game.helpers.resolveUntilIdle();

    expect(Dash.zone("legs")).toHaveLength(0);
    expectFabCard(Dash, knickKnackBricABracRed).toBeIn("graveyard");
  });
});
