import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { wilhelminaPackardTheRadioOperator } from "./085-wilhelmina-packard-the-radio-operator";

describe("Wilhelmina Packard - The Radio Operator", () => {
  it("can be played from hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [wilhelminaPackardTheRadioOperator],
      inkwell: wilhelminaPackardTheRadioOperator.cost,
    });

    expect(
      testEngine.asPlayerOne().playCard(wilhelminaPackardTheRadioOperator),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(wilhelminaPackardTheRadioOperator)).toBe("play");
  });

  it("can quest for 1 lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: wilhelminaPackardTheRadioOperator, exerted: false, isDrying: false }],
    });

    const loreBefore = testEngine.getLore(PLAYER_ONE);
    expect(
      testEngine.asPlayerOne().quest(wilhelminaPackardTheRadioOperator),
    ).toBeSuccessfulCommand();
    expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore + 1);
  });

  it("has no special abilities (vanilla card)", () => {
    expect(wilhelminaPackardTheRadioOperator.vanilla).toBe(true);
    expect(wilhelminaPackardTheRadioOperator.abilities).toBeUndefined();
  });
});
