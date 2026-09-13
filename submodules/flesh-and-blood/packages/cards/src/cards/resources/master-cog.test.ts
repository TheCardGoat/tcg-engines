import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kassai } from "../heroes/kassai.ts";
import { throttleRed } from "../actions/throttle.ts";
import { autosaveScriptBlue } from "../actions/autosave-script.ts";
import { masterCogYellow } from "./master-cog.ts";

/**
 * Master Cog (EVO000) — Mechanologist Resource - Gem, Legendary.
 *
 * Printed: "When this is pitched, you may put a steam counter on an item you
 * control with crank."
 */

describe("Master Cog (EVO000) AAA", () => {
  it("happy: pitching Master Cog puts a steam counter on a crank item", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [masterCogYellow, throttleRed],
        arena: [autosaveScriptBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: kassai, hand: [], life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);

    Dash.must.pitch(masterCogYellow).playAttack(throttleRed);
    game.helpers.resolveUntilIdle({ optionals: "accept", ordering: "listed" });

    expectFabCard(Dash, autosaveScriptBlue).toHaveCounters(2, "steam"); // 1 from entering arena + 1 from Master Cog
    expectFabPlayer(game.as(kassai)).toHaveLife(14); // Throttle Red 6{p}
  });

  it("boundary: declining the optional leaves the crank item unchanged", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [masterCogYellow, throttleRed],
        arena: [autosaveScriptBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: kassai, hand: [], life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);

    Dash.must.pitch(masterCogYellow).playAttack(throttleRed);
    game.helpers.resolveUntilIdle({ optionals: "decline", ordering: "listed" });

    expectFabCard(Dash, autosaveScriptBlue).toHaveCounters(1, "steam"); // only the entry counter
  });
});
