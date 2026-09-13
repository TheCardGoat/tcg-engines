import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { crankshaftRed } from "../actions/crankshaft.ts";
import { throttleRed } from "../actions/throttle.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { heavyIndustryGearShift } from "./heavy-industry-gear-shift.ts";

/**
 * Heavy Industry Gear Shift (AIO006) — Mechanologist Legs d1, Battleworn.
 *
 * Printed: "Action - Destroy this: Banish the top 2 cards of your deck. Gain
 * 1 action point for each Mechanologist card banished this way. Battleworn"
 */
describe("Heavy Industry Gear Shift (AIO006) AAA", () => {
  it("happy: destroying it banishes the top 2 and two Mechanologist cards pay 2 AP", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        legs: [heavyIndustryGearShift],
        hand: [],
        // deckTop is last-entry-is-top: throttle sits on crankshaft.
        deckTop: [crankshaftRed, throttleRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.activate(heavyIndustryGearShift);
    game.untilIdle();

    expectFabCard(Dash, heavyIndustryGearShift).toBeIn("graveyard");
    expect(Dash.zone("banished")).toContain(throttleRed.canonicalId);
    expect(Dash.zone("banished")).toContain(crankshaftRed.canonicalId);
    // 1 spent on the Action, +2 for the two Mechanologist banishes.
    expectFabPlayer(Dash).toHaveAP(2);
  });

  it("boundary: non-Mechanologist banishes still cost the Action but pay no AP", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        legs: [heavyIndustryGearShift],
        hand: [],
        deckTop: [snatchRed, nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.activate(heavyIndustryGearShift);
    game.untilIdle();

    expectFabCard(Dash, heavyIndustryGearShift).toBeIn("graveyard");
    expect(Dash.zone("banished")).toContain(snatchRed.canonicalId);
    expect(Dash.zone("banished")).toContain(nimblismBlue.canonicalId);
    // The supertype count gate granted nothing: 1 − 1 = 0.
    expectFabPlayer(Dash).toHaveAP(0);
  });
});
