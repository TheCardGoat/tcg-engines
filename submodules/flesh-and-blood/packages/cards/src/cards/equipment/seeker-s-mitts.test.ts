import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { seekerSMitts } from "./seeker-s-mitts.ts";

/**
 * Seeker's Mitts (OUT177) — Generic Arms.
 *
 * Printed:
 *   Instant - {r}, destroy Seeker's Mitts: Prevent the next 1 damage that
 *   would be dealt to your hero this turn. Opt 1
 */

describe("Seeker's Mitts (OUT177) AAA", () => {
  it("happy: destroy this to prevent the next 1 of Snatch's 4", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, arms: [seekerSMitts], resourcePoints: 1, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    game.as(bravo).pass();
    Dash.activate(seekerSMitts);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, ordering: "listed" });
    expectFabCard(Dash, seekerSMitts).toBeIn("graveyard");
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(17);
  });

  it("boundary: cannot activate without {r}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arms: [seekerSMitts],
        hand: [],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expect(() => game.as(dash).activate(seekerSMitts)).toThrow();
    expectFabCard(game.as(dash), seekerSMitts).toBeIn("arms");
  });

  it("timing: without activating, Snatch deals the full 4", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, arms: [seekerSMitts], resourcePoints: 1, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabCard(Dash, seekerSMitts).toBeIn("arms");
  });
});
