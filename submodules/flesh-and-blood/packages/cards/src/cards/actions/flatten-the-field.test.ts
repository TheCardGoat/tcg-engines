import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { seismicSurge } from "../tokens/seismic-surge.ts";
import { flattenTheFieldRed } from "./flatten-the-field.ts";

/**
 * Flatten the Field Red (MPG076) — Guardian Attack Action.
 *
 * Printed: Crush - When this deals 4 or more damage to a hero, destroy a
 * Seismic Surge token they control.
 */

describe("Flatten the Field family AAA", () => {
  it("happy: an unblocked 8 hit destroys their Seismic Surge", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [flattenTheFieldRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, arena: [seismicSurge], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(flattenTheFieldRed);
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(12);
    expect(Dash.zone("arena")).not.toContain(seismicSurge.canonicalId);
  });

  it("boundary: less than 4 damage leaves their Seismic Surge", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [flattenTheFieldRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        arena: [seismicSurge],
        hand: [nimblismBlue, nimblismBlue, nimblismBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(flattenTheFieldRed);
    game.advanceCombatTo("defend");
    Dash.defendWith([nimblismBlue, nimblismBlue, nimblismBlue]);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(18);
    expectFabCard(Dash, seismicSurge).toBeIn("arena");
  });

  it("timing: crush with no Surge still deals the hit", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [flattenTheFieldRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(flattenTheFieldRed);
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(12);
  });
});
