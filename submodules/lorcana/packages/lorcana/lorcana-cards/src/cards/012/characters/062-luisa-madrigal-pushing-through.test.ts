import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { luisaMadrigalPushingThrough } from "./062-luisa-madrigal-pushing-through";

describe("Luisa Madrigal - Pushing Through", () => {
  describe("Challenger +2 (While challenging, this character gets +2 {S}.)", () => {
    it("has the Challenger keyword with value 2", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [luisaMadrigalPushingThrough],
        deck: 2,
      });

      const playerOne = testEngine.asPlayerOne();

      expect(playerOne.hasKeyword(luisaMadrigalPushingThrough, "Challenger")).toBe(true);
      expect(testEngine.getKeywordValue(luisaMadrigalPushingThrough, "Challenger")).toBe(2);
    });
  });
});
