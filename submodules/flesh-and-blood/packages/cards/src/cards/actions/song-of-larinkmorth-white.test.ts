import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { melodySingAlong } from "../heroes/melody-sing-along.ts";
import { songOfLarinkmorthWhiteBlue } from "./song-of-larinkmorth-white.ts";

/**
 * Song of Larinkmorth (PEN150) — Bard Action Song, cost 0.
 * Printed: "Create a Frostbite token under each other hero's control."
 */

describe("Song of Larinkmorth (PEN150) AAA", () => {
  it("happy: creates a Frostbite under the one opponent", () => {
    const game = FabTestEngine.start(
      {
        hero: melodySingAlong,
        hand: [songOfLarinkmorthWhiteBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Melody = game.as(melodySingAlong);

    Melody.play(songOfLarinkmorthWhiteBlue);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(game.as(dash)).toHaveTokenCount("frostbite", 1);
    expectFabPlayer(Melody).toHaveTokenCount("frostbite", 0);
    expectFabCard(Melody, songOfLarinkmorthWhiteBlue).toBeIn("graveyard");
  });

  it("boundary: the caster does not receive the Frostbite", () => {
    const game = FabTestEngine.start(
      {
        hero: melodySingAlong,
        hand: [songOfLarinkmorthWhiteBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Melody = game.as(melodySingAlong);

    Melody.play(songOfLarinkmorthWhiteBlue);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Melody).toHaveTokenCount("frostbite", 0);
  });

  it("timing: playing the song consumes an action point", () => {
    const game = FabTestEngine.start(
      {
        hero: melodySingAlong,
        hand: [songOfLarinkmorthWhiteBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Melody = game.as(melodySingAlong);

    Melody.play(songOfLarinkmorthWhiteBlue);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Melody).toHaveAP(0);
  });
});
