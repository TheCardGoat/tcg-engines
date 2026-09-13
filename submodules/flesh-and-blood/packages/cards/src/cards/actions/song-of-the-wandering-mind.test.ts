import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { melodySingAlong } from "../heroes/melody-sing-along.ts";
import { nimblismBlue } from "./nimblism.ts";
import { songOfTheWanderingMindBlue } from "./song-of-the-wandering-mind.ts";

describe("Song of the Wandering Mind (TCC068) AAA", () => {
  it("happy: each other hero draws a card", () => {
    const game = FabTestEngine.start(
      {
        hero: melodySingAlong,
        hand: [songOfTheWanderingMindBlue],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [],
        deckTop: [nimblismBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Melody = game.as(melodySingAlong);
    const Dash = game.as(dash);

    Melody.play(songOfTheWanderingMindBlue);
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, nimblismBlue).toBeIn("hand");
    expectFabPlayer(Dash).toHaveHandCount(1);
    expectFabPlayer(Melody).toHaveHandCount(0);
    expectFabCard(Melody, songOfTheWanderingMindBlue).toBeIn("graveyard");
  });

  it("boundary: the caster does not draw", () => {
    const game = FabTestEngine.start(
      {
        hero: melodySingAlong,
        hand: [songOfTheWanderingMindBlue],
        deckTop: [nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Melody = game.as(melodySingAlong);

    Melody.play(songOfTheWanderingMindBlue);
    game.helpers.resolveUntilIdle();

    expect(Melody.zone("hand")).not.toContain(nimblismBlue.canonicalId);
    expectFabPlayer(Melody).toHaveHandCount(0);
  });

  it("timing: playing the song consumes an action point", () => {
    const game = FabTestEngine.start(
      {
        hero: melodySingAlong,
        hand: [songOfTheWanderingMindBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Melody = game.as(melodySingAlong);

    Melody.play(songOfTheWanderingMindBlue);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Melody).toHaveAP(0);
  });
});
