import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { fatCatFeloniousFeline } from "./182-fat-cat-felonious-feline";

describe("Fat Cat - Felonious Feline", () => {
  describe("Resist +1 (Damage dealt to this character is reduced by 1.)", () => {
    it("grants Resist +1 as a printed keyword ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: fatCatFeloniousFeline, isDrying: false }],
          deck: 3,
        },
        { deck: 3 },
      );

      const playerOne = testEngine.asPlayerOne();

      expect(playerOne.getKeywordValue(fatCatFeloniousFeline, "Resist")).toBe(1);
    });
  });
});
