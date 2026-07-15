import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { plutoSuspiciousSentry } from "./161-pluto-suspicious-sentry";

describe("Pluto - Suspicious Sentry", () => {
  it("has Support", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [plutoSuspiciousSentry],
    });

    expect(testEngine.asPlayerOne().hasKeyword(plutoSuspiciousSentry, "Support")).toBe(true);
  });
});
