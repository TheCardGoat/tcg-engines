import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-engine/testing";
import { nalaMischievousCub } from "./002-nala-mischievous-cub";

describe("Nala - Mischievous Cub", () => {
  it("should be a vanilla card with correct stats", () => {
    const testEngine = new LorcanaTestEngine({
      play: [nalaMischievousCub],
    });

    const cardUnderTest = testEngine.getCardModel(nalaMischievousCub);
    expect(cardUnderTest.strength).toBe(0);
    expect(cardUnderTest.willpower).toBe(4);
    expect(cardUnderTest.lore).toBe(1);
    expect(cardUnderTest.cost).toBe(1);
  });
});
