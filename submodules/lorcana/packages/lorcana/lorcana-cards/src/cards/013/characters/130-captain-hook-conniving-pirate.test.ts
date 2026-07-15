import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { captainHookConnivingPirate } from "./130-captain-hook-conniving-pirate";

const hookDefender = createMockCharacter({
  id: "captain-hook-conniving-defender",
  name: "Hook Defender",
  cost: 2,
  strength: 1,
  willpower: 5,
});

describe("Captain Hook - Conniving Pirate", () => {
  it("gains 1 lore when he challenges another character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: captainHookConnivingPirate, isDrying: false }],
      },
      {
        play: [{ card: hookDefender, exerted: true }],
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(captainHookConnivingPirate, hookDefender),
    ).toBeSuccessfulCommand();
    if (testEngine.asPlayerOne().getBagCount() > 0) {
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(captainHookConnivingPirate),
      ).toBeSuccessfulCommand();
    }

    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(1);
  });
});
