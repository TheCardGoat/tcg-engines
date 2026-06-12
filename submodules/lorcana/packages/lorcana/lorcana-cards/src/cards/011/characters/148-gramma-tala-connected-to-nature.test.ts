import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { grammaTalaConnectedToNature } from "./148-gramma-tala-connected-to-nature";

describe("Gramma Tala - Connected to Nature", () => {
  it("can be played with full ink cost", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [grammaTalaConnectedToNature],
      inkwell: grammaTalaConnectedToNature.cost,
      deck: 2,
    });

    expect(testEngine.asPlayerOne().playCard(grammaTalaConnectedToNature)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(grammaTalaConnectedToNature)).toBe("play");
  });

  it("costs 1 less to play for each card in your inkwell", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [grammaTalaConnectedToNature],
      inkwell: 10,
    });

    expect(testEngine.asPlayerOne().getCard(grammaTalaConnectedToNature).playCost).toBe(2);
    expect(testEngine.asPlayerOne().playCard(grammaTalaConnectedToNature)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(grammaTalaConnectedToNature)).toBe("play");
  });

  it("still cannot be played without enough ink after the discount is applied", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [grammaTalaConnectedToNature],
      inkwell: 1,
    });

    expect(testEngine.asPlayerOne().getCard(grammaTalaConnectedToNature).playCost).toBe(11);
    expect(testEngine.asPlayerOne().playCard(grammaTalaConnectedToNature).success).toBe(false);
    expect(testEngine.asPlayerOne().getCardZone(grammaTalaConnectedToNature)).toBe("hand");
  });
});
