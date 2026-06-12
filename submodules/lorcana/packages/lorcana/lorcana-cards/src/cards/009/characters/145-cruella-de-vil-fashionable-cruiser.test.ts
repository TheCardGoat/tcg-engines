import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { cruellaDeVilFashionableCruiser } from "./145-cruella-de-vil-fashionable-cruiser";

describe("Cruella De Vil - Fashionable Cruiser", () => {
  it("gains Evasive during your turn only", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [cruellaDeVilFashionableCruiser],
        deck: 5,
      },
      {
        deck: 5,
      },
    );

    expect(testEngine.hasKeyword(cruellaDeVilFashionableCruiser, "Evasive")).toBe(true);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.hasKeyword(cruellaDeVilFashionableCruiser, "Evasive")).toBe(false);
  });
});
