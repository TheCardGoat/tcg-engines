import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { figaroTuxedoCat } from "./133-figaro-tuxedo-cat";
import { scarab } from "../items/083-scarab";

describe("Figaro - Tuxedo Cat", () => {
  describe("PLAYFULNESS - Opposing items enter play exerted.", () => {
    it("causes an opposing item to enter play exerted when Figaro is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [scarab],
          inkwell: scarab.cost,
          deck: 2,
        },
        {
          play: [figaroTuxedoCat],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(scarab)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().isExerted(scarab)).toBe(true);
    });

    it("does not cause your own items to enter play exerted when Figaro is in your play zone", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [scarab],
        inkwell: scarab.cost,
        play: [figaroTuxedoCat],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(scarab)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().isExerted(scarab)).toBe(false);
    });
  });
});
