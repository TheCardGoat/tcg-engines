import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { dragonFire, heiheiBoatSnack, mickeyMouseTrueFriend, simbaProtectiveCub } from "../../001";
import { marchingOffToBattle } from "./129-marching-off-to-battle";

describe("Marching Off to Battle", () => {
  it("draws 2 cards if a character was banished earlier this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [dragonFire, marchingOffToBattle],
        inkwell: 9,
        deck: [heiheiBoatSnack, mickeyMouseTrueFriend],
      },
      {
        play: [simbaProtectiveCub],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(dragonFire, {
        targets: [simbaProtectiveCub],
      }).success,
    ).toBe(true);
    expect(testEngine.asPlayerTwo().getCardZone(simbaProtectiveCub)).toBe("discard");

    expect(testEngine.asPlayerOne().playCard(marchingOffToBattle)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(2);
  });

  it("does not draw cards if no character was banished this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [marchingOffToBattle],
      inkwell: marchingOffToBattle.cost,
      deck: [heiheiBoatSnack, mickeyMouseTrueFriend],
    });

    expect(testEngine.asPlayerOne().playCard(marchingOffToBattle)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(0);
  });

  it("regression: draws 2 cards when opponent's character is banished via challenge this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [marchingOffToBattle],
        inkwell: marchingOffToBattle.cost,
        play: [{ card: mickeyMouseTrueFriend, isDrying: false }],
        deck: [heiheiBoatSnack, heiheiBoatSnack],
      },
      {
        play: [{ card: simbaProtectiveCub, exerted: true }],
      },
    );

    // Challenge and banish opponent's character
    expect(
      testEngine.asPlayerOne().challenge(mickeyMouseTrueFriend, simbaProtectiveCub),
    ).toBeSuccessfulCommand();

    // Play Marching Off to Battle - should detect the banish
    expect(testEngine.asPlayerOne().playCard(marchingOffToBattle)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(2);
  });
});
