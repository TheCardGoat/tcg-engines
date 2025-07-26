import { describe, expect, it } from "bun:test";
import { GundamTestEngine } from "./gundam-test-engine";

describe("Gundam Engine", () => {
  it("Should properly initialize the engine's board state", () => {
    const playerOneState = {
      deck: 11,
      resourceDeck: 3,
      resourceArea: 4,
      battleArea: 3,
      shieldBase: 1,
      shieldSection: 4,
      removalArea: 1,
      hand: 6,
      trash: 3,
    };
    const playerTwoState = {
      deck: 8,
      resourceDeck: 4,
      resourceArea: 3,
      battleArea: 4,
      shieldBase: 0,
      shieldSection: 3,
      removalArea: 3,
      hand: 2,
      trash: 2,
    };
    const testEngine = new GundamTestEngine(playerOneState, playerTwoState, {
      skipPreGame: false,
    });

    // Test that zones are properly initialized
    testEngine.assertThatZonesContain(playerOneState, "player_one");
    testEngine.assertThatZonesContain(playerTwoState, "player_two");
  });

  it("Should initialize engine's board defaults state", () => {
    const defaults = {
      deck: 15,
      resourceDeck: 10,
      resourceArea: 0,
      shieldBase: 1, // EX Base token is added by default per game rules
      shieldSection: 6,
      battleArea: 0,
      removalArea: 0,
      hand: 0,
      trash: 0,
    };

    const testEngine = new GundamTestEngine();

    // Test that zones are properly initialized
    testEngine.assertThatZonesContain(defaults, "player_one");
    testEngine.assertThatZonesContain(defaults, "player_two");
  });

  it("Should initialize engine's board defaults state", () => {
    const defaults = {
      deck: 15,
      resourceDeck: 10,
      resourceArea: 0,
      shieldBase: 1, // EX Base token is added by default per game rules
      shieldSection: 6,
      battleArea: 0,
      removalArea: 0,
      hand: 0,
      trash: 0,
    };

    const testEngine = new GundamTestEngine();

    testEngine.assertThatZonesContain(defaults, "player_one");
    testEngine.assertThatZonesContain(defaults, "player_two");

    expect(testEngine.getGameSegment()).toEqual("duringGame");
    expect(testEngine.getGamePhase()).toEqual("mainPhase");
  });

  it("When skipPreGame is false, game segment should be startingAGame", () => {
    const testEngine = new GundamTestEngine(undefined, undefined, {
      skipPreGame: false,
    });

    expect(testEngine.getGameSegment()).toEqual("startingAGame");
  });
});
