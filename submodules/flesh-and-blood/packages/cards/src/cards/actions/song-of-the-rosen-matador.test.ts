import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { melodySingAlong } from "../heroes/melody-sing-along.ts";
import { songOfTheRosenMatadorBlue } from "./song-of-the-rosen-matador.ts";

/**
 * Song of the Rosen Matador (TCC066) — Bard Action Song, cost 0.
 * Printed: "Create a Vigor token under each other hero's control."
 */

describe("Song of the Rosen Matador (TCC066) AAA", () => {
  it("happy: creates a Vigor under the one opponent", () => {
    const game = FabTestEngine.start(
      { hero: melodySingAlong, hand: [songOfTheRosenMatadorBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Melody = game.as(melodySingAlong);

    Melody.play(songOfTheRosenMatadorBlue);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(game.as(dash)).toHaveTokenCount("vigor", 1);
    expectFabPlayer(Melody).toHaveTokenCount("vigor", 0);
    expectFabCard(Melody, songOfTheRosenMatadorBlue).toBeIn("graveyard");
  });

  it("boundary: the caster does not receive Vigor", () => {
    const game = FabTestEngine.start(
      { hero: melodySingAlong, hand: [songOfTheRosenMatadorBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Melody = game.as(melodySingAlong);

    Melody.play(songOfTheRosenMatadorBlue);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Melody).toHaveTokenCount("vigor", 0);
  });
});
