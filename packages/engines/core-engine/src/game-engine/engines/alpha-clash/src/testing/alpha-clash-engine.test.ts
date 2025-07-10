import { describe, expect, it } from "bun:test";
import { AlphaClashTestEngine } from "./alpha-clash-test-engine";

describe("Alpha Clash Engine", () => {
  it("should properly initialize the engine's board state", () => {
    const playerOneState = {
      deck: 30,
      hand: 5,
      contender: undefined,
      clash: [],
      resource: 0,
      accessory: [],
      clashground: undefined,
      oblivion: [],
      standby: [],
    };
    const playerTwoState = {
      deck: 30,
      hand: 5,
      contender: undefined,
      clash: [],
      resource: 0,
      accessory: [],
      clashground: undefined,
      oblivion: [],
      standby: [],
    };

    const testEngine = new AlphaClashTestEngine(
      playerOneState,
      playerTwoState,
      {
        skipPreGame: false,
      },
    );

    // Test that zones are properly initialized
    testEngine.assertThatZonesContain(playerOneState, "player_one");
    testEngine.assertThatZonesContain(playerTwoState, "player_two");
  });

  it("should initialize engine's board defaults state", () => {
    const defaults = {
      deck: 30,
      hand: 5,
      contender: undefined,
      clashground: undefined,
      clash: [],
      accessory: [],
      resource: 0,
      oblivion: [],
      standby: [],
    };

    const testEngine = new AlphaClashTestEngine();

    // Test that zones are properly initialized
    testEngine.assertThatZonesContain(defaults, "player_one");
    testEngine.assertThatZonesContain(defaults, "player_two");
  });

  it("should properly initialize GameEngine inheritance", () => {
    const testEngine = new AlphaClashTestEngine();

    expect(testEngine.getGameSegment()).toEqual("duringGame");
    expect(testEngine.getGamePhase()).toEqual("primary");
  });

  it("when skipPreGame is false, game segment should be startingAGame", () => {
    const testEngine = new AlphaClashTestEngine(undefined, undefined, {
      skipPreGame: false,
    });

    expect(testEngine.getGameSegment()).toEqual("startingAGame");
  });

  it("should implement StandardMoves interface", () => {
    const testEngine = new AlphaClashTestEngine();

    // Should have concede move
    expect(typeof testEngine.authoritativeEngine.moves.concede).toBe(
      "function",
    );
  });
});
