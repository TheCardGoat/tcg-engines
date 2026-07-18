import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { mickeyMouseTrueFriend, simbaProtectiveCub } from "../../001";
import { circleOfLife } from "./026-circle-of-life";
import { circleOfLifeEnchanted } from "./225-circle-of-life-enchanted";

describe("Circle of Life", () => {
  it("authors Sing Together 8 on both printings", () => {
    for (const printing of [circleOfLife, circleOfLifeEnchanted]) {
      expect(printing.abilities).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ keyword: "SingTogether", type: "keyword", value: 8 }),
        ]),
      );
    }
  });

  it("plays a character from your discard for free", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [circleOfLife],
      inkwell: circleOfLife.cost,
      discard: [simbaProtectiveCub, mickeyMouseTrueFriend],
    });

    const playResult = testEngine.asPlayerOne().playCard(circleOfLife, {
      targets: [simbaProtectiveCub],
    });

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(simbaProtectiveCub)).toBe("play");
  });

  it("plays the chosen character when multiple characters are in discard", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [circleOfLife],
      inkwell: circleOfLife.cost,
      discard: [simbaProtectiveCub, mickeyMouseTrueFriend],
    });

    const playResult = testEngine.asPlayerOne().playCard(circleOfLife, {
      targets: [mickeyMouseTrueFriend],
    });

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(mickeyMouseTrueFriend)).toBe("play");
    expect(testEngine.asPlayerOne().getCardZone(simbaProtectiveCub)).toBe("discard");
  });
});
