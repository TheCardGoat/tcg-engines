import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { beastFierceDefender } from "./122-beast-fierce-defender";

const belle = createMockCharacter({
  id: "beast-fierce-defender-belle",
  name: "Belle",
  cost: 2,
});

describe("Beast - Fierce Defender", () => {
  it("gets +2 strength while you have Belle in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [beastFierceDefender, belle],
    });

    expect(testEngine.asPlayerOne().getCardStrength(beastFierceDefender)).toBe(
      beastFierceDefender.strength + 2,
    );
  });
});
