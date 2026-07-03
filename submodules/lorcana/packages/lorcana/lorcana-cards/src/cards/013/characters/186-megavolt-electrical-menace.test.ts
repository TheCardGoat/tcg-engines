import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { megavoltElectricalMenace } from "./186-megavolt-electrical-menace";

describe("Megavolt - Electrical Menace", () => {
  it("gains Resist +2 while you have no cards in hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [megavoltElectricalMenace],
      hand: [],
    });

    expect(testEngine.asPlayerOne().getKeywordValue(megavoltElectricalMenace, "Resist")).toBe(2);
  });
});
