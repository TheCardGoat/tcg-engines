import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { geyserOfSeismicStirringsRed } from "./geyser-of-seismic-stirrings.ts";

/**
 * Geyser of Seismic Stirrings Red (MPG103) — Guardian Action Aura. Go
 * again.
 *
 * Printed: This enters the arena with 3 energy counters. When this has
 * none, destroy it.
 * At the beginning of your end phase, remove an energy counter from this
 * and create a Seismic Surge token.
 */

describe("Geyser of Seismic Stirrings (MPG103) AAA", () => {
  it("happy: removes an energy counter and creates a Seismic Surge at end phase", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [geyserOfSeismicStirringsRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(geyserOfSeismicStirringsRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expectFabCard(Bravo, geyserOfSeismicStirringsRed).toBeIn("arena");
    expectFabCard(Bravo, geyserOfSeismicStirringsRed).toHaveCounters(3, "energy");

    Bravo.endTurn();
    game.helpers.resolveUntilIdle({ entityTargets: "minimum", optionalBoolean: false });
    expectFabCard(Bravo, geyserOfSeismicStirringsRed).toHaveCounters(2, "energy");
    expectFabCard(Bravo, geyserOfSeismicStirringsRed).toBeIn("arena");
    expectFabPlayer(Bravo).toHaveTokenCount("seismic-surge", 1);
  });

  it("boundary: destroying the final counter removes the Geyser from the arena", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [geyserOfSeismicStirringsRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(geyserOfSeismicStirringsRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    for (let cycle = 0; cycle < 3; cycle += 1) {
      Bravo.endTurn();
      game.helpers.resolveUntilIdle({ entityTargets: "minimum", optionalBoolean: false });
      if (cycle < 2) {
        expectFabCard(Bravo, geyserOfSeismicStirringsRed).toHaveCounters(2 - cycle, "energy");
        expectFabPlayer(Bravo).toHaveTokenCount("seismic-surge", 1);
      }
      if (cycle < 2) {
        Dash.endTurn();
        game.helpers.resolveUntilIdle({ entityTargets: "minimum", optionalBoolean: false });
      }
    }

    expectFabCard(Bravo, geyserOfSeismicStirringsRed).toBeIn("graveyard");
    // Seismic Surges expire at the start of their controller's next action
    // phase, so only the final end-phase token remains visible here.
    expectFabPlayer(Bravo).toHaveTokenCount("seismic-surge", 1);
  });
});
