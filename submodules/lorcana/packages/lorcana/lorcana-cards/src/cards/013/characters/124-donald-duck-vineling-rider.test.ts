import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { donaldDuckVinelingRider } from "./124-donald-duck-vineling-rider";

describe("Donald Duck - Vineling Rider", () => {
  it("has Rush", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [donaldDuckVinelingRider],
    });

    expect(testEngine.asPlayerOne().hasKeyword(donaldDuckVinelingRider, "Rush")).toBe(true);
  });
});
