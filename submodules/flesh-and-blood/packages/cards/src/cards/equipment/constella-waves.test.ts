import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { zapRed } from "../actions/zap.ts";
import { oscilioScionOfTheThirdAge } from "../heroes/oscilio-scion-of-the-third-age.ts";
import { constellaWaves } from "./constella-waves.ts";

/**
 * Constella Waves (OMN097) — Lightning Wizard Arms.
 *
 * Printed:
 *   Instant - {t} your hero, destroy this: Amp 1
 */

describe("Constella Waves (OMN097) AAA", () => {
  it("happy: tap the hero and destroy this so the next Zap deals 3+1 arcane", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilioScionOfTheThirdAge,
        arms: [constellaWaves],
        hand: [zapRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilioScionOfTheThirdAge);
    const Dash = game.as(dash);

    Oscilio.activate(constellaWaves);
    game.helpers.resolveUntilIdle();

    expectFabCard(Oscilio, constellaWaves).toBeIn("graveyard");
    expectFabCard(Oscilio, oscilioScionOfTheThirdAge).toBeTapped();

    Oscilio.play(zapRed, { target: Dash.id });
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabPlayer(Dash).toHaveLife(16);
  });

  it("boundary: a tapped hero cannot pay the tap-hero cost", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilioScionOfTheThirdAge,
        heroState: { tapped: true },
        arms: [constellaWaves],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );

    expect(() => game.as(oscilioScionOfTheThirdAge).activate(constellaWaves)).toThrow();
    expectFabCard(game.as(oscilioScionOfTheThirdAge), constellaWaves).toBeIn("arms");
  });

  it("timing: Amp 1 is consumed by the first arcane event this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilioScionOfTheThirdAge,
        arms: [constellaWaves],
        hand: [zapRed, zapRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilioScionOfTheThirdAge);
    const Dash = game.as(dash);

    Oscilio.activate(constellaWaves);
    game.helpers.resolveUntilIdle();
    Oscilio.play(zapRed, { target: Dash.id });
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    expectFabPlayer(Dash).toHaveLife(16);

    Oscilio.play(zapRed, { target: Dash.id });
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    expectFabPlayer(Dash).toHaveLife(13);
  });
});
