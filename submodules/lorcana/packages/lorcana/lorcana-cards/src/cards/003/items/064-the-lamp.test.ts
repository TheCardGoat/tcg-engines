import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { genieCrampedInTheLamp, genieSupportiveFriend, jafarLampThief } from "../characters";
import { theLamp } from "./064-the-lamp";

describe("The Lamp", () => {
  it("draws 2 cards if you have Jafar in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: 2,
      play: [theLamp, jafarLampThief],
    });

    const result = testEngine.asPlayerOne().activateAbility(theLamp, {
      ability: "GOOD OR EVIL",
    });

    expect(result).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(theLamp)).toBe("discard");
    expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 2, deck: 0 });
  });

  it("returns the chosen character with cost 4 or less if you have Genie in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [theLamp, genieCrampedInTheLamp],
      },
      {
        play: [genieSupportiveFriend],
      },
    );

    const result = testEngine.asPlayerOne().activateAbility(theLamp, {
      ability: "GOOD OR EVIL",
      targets: [genieSupportiveFriend],
    });

    expect(result).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(theLamp)).toBe("discard");
    expect(testEngine.asPlayerTwo().getCardZone(genieSupportiveFriend)).toBe("hand");
  });

  it("does both effects when you have both Jafar and Genie in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 2,
        play: [theLamp, genieCrampedInTheLamp, jafarLampThief],
      },
      {
        play: [genieSupportiveFriend],
      },
    );

    const result = testEngine.asPlayerOne().activateAbility(theLamp, {
      ability: "GOOD OR EVIL",
      targets: [genieSupportiveFriend],
    });

    expect(result).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(theLamp)).toBe("discard");
    expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 2, deck: 0 });
    expect(testEngine.asPlayerTwo().getCardZone(genieSupportiveFriend)).toBe("hand");
  });

  it("does nothing if you have neither Jafar nor Genie in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 2,
        play: [theLamp],
      },
      {
        play: [genieSupportiveFriend],
      },
    );

    const result = testEngine.asPlayerOne().activateAbility(theLamp, {
      ability: "GOOD OR EVIL",
    });

    expect(result).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(theLamp)).toBe("discard");
    expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 0, deck: 2 });
    expect(testEngine.asPlayerTwo().getCardZone(genieSupportiveFriend)).toBe("play");
  });
});
