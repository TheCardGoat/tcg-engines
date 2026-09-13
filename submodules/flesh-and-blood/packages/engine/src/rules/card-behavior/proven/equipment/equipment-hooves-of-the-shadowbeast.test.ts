/**
 * LEV007 Hooves of the Shadowbeast — Shadow Brute Legs d1 battleworn.
 * Printed: Whenever a card with 6 or more {p} is put into your banished
 * zone, you may destroy Hooves of the Shadowbeast. If you do, gain 1 action
 * point.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, throttleRed } from "../../../fixtures.ts";
import { hoovesOfTheShadowbeast } from "../../../../../../cards/src/cards/equipment/hooves-of-the-shadowbeast.ts";

describe("hooves-of-the-shadowbeast (LEV007)", () => {
  it("AAA: power-6+ banish → destroy self → gain 1 action point", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        legs: [hoovesOfTheShadowbeast],
        hand: [throttleRed],
        actionPoints: 1,
        resourcePoints: 2,
        // Throttle (power 6) on deck top is banished by its own boost.
        deck: [throttleRed, throttleRed, throttleRed, throttleRed, throttleRed],
      },
      { hero: bravo, deck: 6, actionPoints: 0 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);

    // Dash plays Throttle with boost → deck-top Throttle (power 6) banished
    // into Dash's own banished zone.
    Dash.play(throttleRed, { boost: true });
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    // Hooves destroyed by the trigger → GY; +1 AP gained.
    expect(Dash.zone("legs")).not.toContain(hoovesOfTheShadowbeast.canonicalId);
    expect(Dash.zone("graveyard")).toContain(hoovesOfTheShadowbeast.canonicalId);
    expect(Dash.actionPoints()).toBeGreaterThan(0);
  });

  it("boundary: decline → hooves stay, no AP", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        legs: [hoovesOfTheShadowbeast],
        hand: [throttleRed],
        actionPoints: 1,
        resourcePoints: 2,
        deck: [throttleRed, throttleRed, throttleRed, throttleRed, throttleRed],
      },
      { hero: bravo, deck: 6, actionPoints: 0 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);

    Dash.play(throttleRed, { boost: true });
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expect(Dash.zone("legs")).toContain(hoovesOfTheShadowbeast.canonicalId);
    expect(Dash.zone("graveyard")).not.toContain(hoovesOfTheShadowbeast.canonicalId);
    // No AP from the trigger (base turn AP is 1 — Throttle's own go-again).
    expect(Dash.actionPoints()).toBe(1);
  });
});
