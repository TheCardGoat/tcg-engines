import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { mirabelMadrigalHopefulDreamer } from "./013-mirabel-madrigal-hopeful-dreamer";

describe("Mirabel Madrigal - Hopeful Dreamer", () => {
  it("has Evasive keyword", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [mirabelMadrigalHopefulDreamer],
    });

    expect(testEngine.hasKeyword(mirabelMadrigalHopefulDreamer, "Evasive")).toBe(true);
  });

  it("has Singer 5 keyword", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [mirabelMadrigalHopefulDreamer],
    });

    expect(testEngine.hasKeyword(mirabelMadrigalHopefulDreamer, "Singer")).toBe(true);
  });
});
