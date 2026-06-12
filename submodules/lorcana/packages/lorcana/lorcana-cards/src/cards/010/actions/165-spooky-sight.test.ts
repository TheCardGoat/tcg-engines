import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { goofyKnightForADay } from "../../002";
import { simbaProtectiveCub } from "../../001";
import { mowgliManCub } from "../characters/019-mowgli-man-cub";
import { scarEerilyPrepared } from "../characters/153-scar-eerily-prepared";
import { spookySight } from "./165-spooky-sight";

describe("Spooky Sight", () => {
  it("puts all characters with cost 3 or less into their players' inkwells facedown and exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [spookySight],
        inkwell: spookySight.cost,
        play: [simbaProtectiveCub, scarEerilyPrepared],
      },
      {
        play: [mowgliManCub, goofyKnightForADay],
      },
    );
    const simbaId = testEngine.findCardInstanceId(simbaProtectiveCub, "play", "p1");
    const mowgliId = testEngine.findCardInstanceId(mowgliManCub, "play", "p2");

    const playResult = testEngine.asPlayerOne().playCard(spookySight);

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(simbaId)).toBe("inkwell");
    expect(testEngine.asPlayerTwo().getCardZone(mowgliId)).toBe("inkwell");
    expect(testEngine.asPlayerOne().getCardZone(scarEerilyPrepared)).toBe("play");
    expect(testEngine.asPlayerTwo().getCardZone(goofyKnightForADay)).toBe("play");

    expect(testEngine.asServer().getCard(simbaId)).toEqual(
      expect.objectContaining({ zone: "inkwell", exerted: true }),
    );
    expect(testEngine.asServer().getCard(mowgliId)).toEqual(
      expect.objectContaining({ zone: "inkwell", exerted: true }),
    );
  });

  it("regression: sends opponent's characters to inkwell, not just controller's", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [spookySight],
        inkwell: spookySight.cost,
      },
      {
        play: [mowgliManCub],
      },
    );

    expect(testEngine.asPlayerOne().playCard(spookySight)).toBeSuccessfulCommand();

    // Opponent's cheap character should be moved to opponent's inkwell
    expect(testEngine.asPlayerTwo().getCardZone(mowgliManCub)).toBe("inkwell");
  });
});
