import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { melodySingAlong } from "../heroes/melody-sing-along.ts";
import { songOfTheShiningKnightBlue } from "./song-of-the-shining-knight.ts";

/**
 * Song of the Shining Knight (TCC067) — Bard Action Song, cost 0.
 * Printed: "Create a Might token under each other hero's control."
 */

describe("Song of the Shining Knight (TCC067) AAA", () => {
  it("happy: creates a Might under the one opponent", () => {
    const game = FabTestEngine.start(
      { hero: melodySingAlong, hand: [songOfTheShiningKnightBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Melody = game.as(melodySingAlong);

    Melody.play(songOfTheShiningKnightBlue);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(game.as(dash)).toHaveTokenCount("might", 1);
    expectFabPlayer(Melody).toHaveTokenCount("might", 0);
    expectFabCard(Melody, songOfTheShiningKnightBlue).toBeIn("graveyard");
  });

  it("boundary: the caster does not receive Might", () => {
    const game = FabTestEngine.start(
      { hero: melodySingAlong, hand: [songOfTheShiningKnightBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Melody = game.as(melodySingAlong);

    Melody.play(songOfTheShiningKnightBlue);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Melody).toHaveTokenCount("might", 0);
  });
});
