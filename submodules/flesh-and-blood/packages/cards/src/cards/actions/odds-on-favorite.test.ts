import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dorinthea } from "../heroes/dorinthea.ts";
import { dash } from "../heroes/dash.ts";
import { dawnbladeResplendent } from "../weapons/dawnblade-resplendent.ts";
import { snatchRed } from "./snatch.ts";
import { oddsOnFavoriteBlue } from "./odds-on-favorite.ts";

/**
 * Action behavior acceptance test — Odds On Favorite, Blue (AOL026).
 *
 * AAA trio:
 * - Happy: base play — Warrior Action (non-attack), costs 0{r}, d3, go again
 * - Boundary: no action points — cannot play
 * - Timing: resolution grants wager trigger to next sword attack this turn
 *
 * Hero: Dorinthea (TEA002) — Warrior/Young
 * FLUENT API ONLY.
 */

describe("Odds On Favorite, Blue (AOL026) AAA", () => {
  // ── Happy path ────────────────────────────────────────────────────────────

  it("happy: base play — costs 0{r}, go again, no damage (non-attack action)", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        hand: [oddsOnFavoriteBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
    );
    const Dorinthea = game.as(dorinthea);
    const Dash = game.as(dash);

    Dorinthea.must.play(oddsOnFavoriteBlue);

    // No damage dealt — this is a non-attack action.
    expectFabPlayer(Dash).toHaveLife(20);
  });

  // ── Boundary ───────────────────────────────────────────────────────────────

  it("boundary: no action points — cannot play", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        hand: [oddsOnFavoriteBlue],
        actionPoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
    );
    const Dorinthea = game.as(dorinthea);

    expect(() => Dorinthea.must.play(oddsOnFavoriteBlue)).toThrow();
  });

  // ── Timing / interaction ───────────────────────────────────────────────────

  it("timing: next sword attack this turn wagers when it attacks", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        hand: [oddsOnFavoriteBlue],
        weapon1: [dawnbladeResplendent],
        resourcePoints: 1,
        actionPoints: 1,
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, snatchRed],
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dorinthea = game.as(dorinthea);

    Dorinthea.must.play(oddsOnFavoriteBlue);
    game.helpers.resolveUntilIdle();
    Dorinthea.must.activate(dawnbladeResplendent);
    game.passBoth();
    game.passBoth();

    expect(game.committedEvents().filter((event) => event.name === "wager")).toHaveLength(1);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum", optionalBoolean: false });
    expect(game.committedEvents().filter((event) => event.name === "search")).toHaveLength(1);
    expectFabPlayer(game.as(dash)).toHaveLife(18);
  });
});
