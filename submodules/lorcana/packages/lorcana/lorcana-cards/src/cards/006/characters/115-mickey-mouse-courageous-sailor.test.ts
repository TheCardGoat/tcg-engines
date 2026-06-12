import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockLocation } from "@tcg/lorcana-engine/testing";
import { mickeyMouseCourageousSailor } from "./115-mickey-mouse-courageous-sailor";

const testLocation = createMockLocation({
  id: "courageous-sailor-location",
  name: "Test Location",
  cost: 2,
  willpower: 4,
  lore: 1,
});

describe("Mickey Mouse - Courageous Sailor", () => {
  describe("SOLID GROUND - +2 strength while at a location", () => {
    it("gets +2 strength while at a location", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: mickeyMouseCourageousSailor, atLocation: testLocation }, testLocation],
      });

      const card = testEngine.asPlayerOne().getCard(mickeyMouseCourageousSailor);
      expect(card.strength).toBe(mickeyMouseCourageousSailor.strength + 2);
    });

    it("has no strength bonus when not at a location", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [mickeyMouseCourageousSailor, testLocation],
      });

      const card = testEngine.asPlayerOne().getCard(mickeyMouseCourageousSailor);
      expect(card.strength).toBe(mickeyMouseCourageousSailor.strength);
    });
  });
});
