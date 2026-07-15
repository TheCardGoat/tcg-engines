import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { heiheiBoatSnack, mickeyMouseTrueFriend, simbaProtectiveCub } from "../../001";
import { goofyKnightForADay } from "../../002";
import { ohanaMeansFamily } from "./032-ohana-means-family";

describe("Ohana Means Family", () => {
  it("removes all damage from chosen character of yours and draws one card per damage removed", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [ohanaMeansFamily],
      inkwell: ohanaMeansFamily.cost,
      play: [goofyKnightForADay],
      deck: [heiheiBoatSnack, mickeyMouseTrueFriend, simbaProtectiveCub],
    });

    expect(testEngine.asServer().manualSetDamage(goofyKnightForADay, 3)).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().playCardTo(ohanaMeansFamily, goofyKnightForADay),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getDamage(goofyKnightForADay)).toBe(0);
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(3);
  });

  it("does not heal opposing characters when targeting your own character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [ohanaMeansFamily],
        inkwell: ohanaMeansFamily.cost,
        play: [goofyKnightForADay],
        deck: [heiheiBoatSnack, mickeyMouseTrueFriend, simbaProtectiveCub],
      },
      {
        play: [simbaProtectiveCub],
      },
    );

    expect(testEngine.asServer().manualSetDamage(goofyKnightForADay, 2)).toBeSuccessfulCommand();
    expect(testEngine.asServer().manualSetDamage(simbaProtectiveCub, 2)).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().playCardTo(ohanaMeansFamily, goofyKnightForADay),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getDamage(goofyKnightForADay)).toBe(0);
    expect(testEngine.asPlayerTwo().getDamage(simbaProtectiveCub)).toBe(2);
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(2);
  });

  it("only heals the chosen character, not other damaged characters you control", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [ohanaMeansFamily],
      inkwell: ohanaMeansFamily.cost,
      play: [goofyKnightForADay, mickeyMouseTrueFriend],
      deck: [heiheiBoatSnack, simbaProtectiveCub, simbaProtectiveCub],
    });

    expect(testEngine.asServer().manualSetDamage(goofyKnightForADay, 3)).toBeSuccessfulCommand();
    expect(testEngine.asServer().manualSetDamage(mickeyMouseTrueFriend, 2)).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().playCardTo(ohanaMeansFamily, goofyKnightForADay),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getDamage(goofyKnightForADay)).toBe(0);
    expect(testEngine.asPlayerOne().getDamage(mickeyMouseTrueFriend)).toBe(2);
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(3);
  });

  it("draws no cards if chosen character has no damage", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [ohanaMeansFamily],
      inkwell: ohanaMeansFamily.cost,
      play: [goofyKnightForADay],
      deck: [heiheiBoatSnack, mickeyMouseTrueFriend, simbaProtectiveCub],
    });

    expect(
      testEngine.asPlayerOne().playCardTo(ohanaMeansFamily, goofyKnightForADay),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getDamage(goofyKnightForADay)).toBe(0);
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(0);
    expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(3);
  });
});
