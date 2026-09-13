import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { melodySingAlong } from "../heroes/melody-sing-along.ts";
import { songOfJackBeQuickBlue } from "./song-of-jack-be-quick.ts";

/**
 * Song of Jack Be Quick (TCC064) — Bard Action Song, cost 0.
 * Printed: "Create a Quicken token under each other hero's control."
 */

describe("Song of Jack Be Quick (TCC064) AAA", () => {
  it("happy: creates a Quicken under the one opponent", () => {
    const game = FabTestEngine.start(
      { hero: melodySingAlong, hand: [songOfJackBeQuickBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Melody = game.as(melodySingAlong);

    Melody.play(songOfJackBeQuickBlue);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(game.as(dash)).toHaveTokenCount("quicken", 1);
    expectFabPlayer(Melody).toHaveTokenCount("quicken", 0);
    expectFabCard(Melody, songOfJackBeQuickBlue).toBeIn("graveyard");
  });

  it("boundary: the caster does not receive Quicken", () => {
    const game = FabTestEngine.start(
      { hero: melodySingAlong, hand: [songOfJackBeQuickBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Melody = game.as(melodySingAlong);

    Melody.play(songOfJackBeQuickBlue);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Melody).toHaveTokenCount("quicken", 0);
  });
});
