import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { cruellaDeVilFashionableCruiser } from "./144-cruella-de-vil-fashionable-cruiser";

describe("Cruella De Vil - Fashionable Cruiser", () => {
  it("NOW GET GOING grants Evasive during your turn and removes it on the opponent turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [cruellaDeVilFashionableCruiser],
      deck: 1,
    });

    expect(testEngine.hasKeyword(cruellaDeVilFashionableCruiser, "Evasive")).toBe(true);

    expect(testEngine.asServer().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.hasKeyword(cruellaDeVilFashionableCruiser, "Evasive")).toBe(false);
  });
});
