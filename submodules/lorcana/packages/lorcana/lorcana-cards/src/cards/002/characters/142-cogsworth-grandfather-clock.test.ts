import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { cogsworthGrandfatherClock } from "./142-cogsworth-grandfather-clock";

const ally = createMockCharacter({
  id: "cogs-ally",
  name: "Ally Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const anotherAlly = createMockCharacter({
  id: "cogs-another-ally",
  name: "Another Ally",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
});

describe("Cogsworth - Grandfather Clock", () => {
  it("has Shift keyword", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [cogsworthGrandfatherClock],
    });
    expect(testEngine.hasKeyword(cogsworthGrandfatherClock, "Shift")).toBe(true);
  });

  it("has Ward keyword", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [cogsworthGrandfatherClock],
    });
    expect(testEngine.hasKeyword(cogsworthGrandfatherClock, "Ward")).toBe(true);
  });

  describe("UNWIND - Your other characters gain Resist +1", () => {
    it("grants Resist to other characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [cogsworthGrandfatherClock, ally, anotherAlly],
      });
      expect(testEngine.hasKeyword(ally, "Resist")).toBe(true);
      expect(testEngine.hasKeyword(anotherAlly, "Resist")).toBe(true);
    });

    it("does not grant Resist to Cogsworth himself", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [cogsworthGrandfatherClock, ally],
      });
      expect(testEngine.hasKeyword(cogsworthGrandfatherClock, "Resist")).toBe(false);
    });

    it("two Cogsworths give Resist to each other", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [cogsworthGrandfatherClock, cogsworthGrandfatherClock],
      });
      expect(testEngine.hasKeyword(cogsworthGrandfatherClock, "Resist")).toBe(true);
    });
  });
});
