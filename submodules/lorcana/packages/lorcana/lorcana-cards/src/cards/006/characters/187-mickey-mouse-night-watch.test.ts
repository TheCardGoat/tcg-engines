import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { mickeyMouseNightWatch } from "./187-mickey-mouse-night-watch";

const mockPluto = createMockCharacter({
  id: "mm-nw-pluto",
  name: "Pluto",
  cost: 3,
  strength: 1,
  willpower: 5,
});

const mockOther = createMockCharacter({
  id: "mm-nw-other",
  name: "Donald Duck",
  cost: 2,
  strength: 1,
  willpower: 2,
});

describe("Mickey Mouse - Night Watch", () => {
  describe("SUPPORT - Your Pluto characters get Resist +1.", () => {
    it("Pluto characters gain Resist +1", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [mickeyMouseNightWatch, mockPluto],
      });

      expect(testEngine.asPlayerOne().hasKeyword(mockPluto, "Resist")).toBe(true);
    });

    it("non-Pluto characters do NOT gain Resist", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [mickeyMouseNightWatch, mockOther],
      });

      expect(testEngine.asPlayerOne().hasKeyword(mockOther, "Resist")).toBe(false);
    });
  });
});
