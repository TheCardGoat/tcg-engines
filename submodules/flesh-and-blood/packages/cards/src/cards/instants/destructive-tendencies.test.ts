import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { gold } from "../tokens/gold.ts";
import { energyPotionBlue } from "../actions/energy-potion.ts";
import { seismicSurge } from "../tokens/seismic-surge.ts";
import { destructiveTendenciesBlue } from "./destructive-tendencies.ts";

describe("Destructive Tendencies (PEN328) AAA", () => {
  it("happy: item-token mode removes all counters from the targeted token", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [destructiveTendenciesBlue],
        arena: [{ card: gold, state: { namedCounters: { steam: 2 } } }],
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(destructiveTendenciesBlue, {
      modeIndexes: [0],
      targetInstanceId: Dash.findCardInZone("arena", gold),
    });
    game.passBoth();

    expectFabCard(Dash, gold).toHaveCounters(0, "steam");
    expectFabCard(Dash, destructiveTendenciesBlue).toBeIn("graveyard");
  });

  it("boundary: a non-token item is not a legal target", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [destructiveTendenciesBlue],
        arena: [{ card: energyPotionBlue, state: { powerCounterTotal: 2 } }],
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    expect(() => Dash.play(destructiveTendenciesBlue, { modeIndexes: [0] })).toThrow();
    expectFabCard(Dash, destructiveTendenciesBlue).toBeIn("hand");
    expectFabCard(Dash, energyPotionBlue).toHaveCounters(2);
  });

  it("timing: both modes can be chosen in one play", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [destructiveTendenciesBlue],
        arena: [
          { card: gold, state: { namedCounters: { steam: 1 } } },
          { card: seismicSurge, state: { namedCounters: { flow: 2 } } },
        ],
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(destructiveTendenciesBlue, {
      modeIndexes: [0, 1],
    });
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Dash, gold).toHaveCounters(0, "steam");
    expectFabCard(Dash, seismicSurge).toHaveCounters(0, "flow");
    expectFabCard(Dash, destructiveTendenciesBlue).toBeIn("graveyard");
  });
});
