import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { motherGothelWitheredAndWicked } from "./116-mother-gothel-withered-and-wicked";

describe("Mother Gothel - Withered and Wicked", () => {
  it("WHAT HAVE YOU DONE?! - This character enters play with 3 damage", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [motherGothelWitheredAndWicked],
      inkwell: motherGothelWitheredAndWicked.cost,
    });

    expect(
      testEngine.asPlayerOne().playCard(motherGothelWitheredAndWicked),
    ).toBeSuccessfulCommand();

    const gothel = testEngine.asPlayerOne().getCard(motherGothelWitheredAndWicked);
    expect(gothel.damage).toBe(3);
  });

  it("WHAT HAVE YOU DONE?! - Mother Gothel survives because willpower (4) > damage (3)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [motherGothelWitheredAndWicked],
      inkwell: motherGothelWitheredAndWicked.cost,
    });

    expect(
      testEngine.asPlayerOne().playCard(motherGothelWitheredAndWicked),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(motherGothelWitheredAndWicked)).toBe("play");
  });
});
