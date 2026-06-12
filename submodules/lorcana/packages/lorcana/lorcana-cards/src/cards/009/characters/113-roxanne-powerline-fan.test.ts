import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { roxannePowerlineFan } from "./113-roxanne-powerline-fan";
import { powerlineWorldsGreatestRockStar } from "./110-powerline-worlds-greatest-rock-star";

const nonSingerCharacter = createMockCharacter({
  id: "roxanne-009-test-non-singer",
  name: "Non-Singer Character",
  cost: 1,
});

describe("Roxanne - Powerline Fan", () => {
  it("CONCERT LOVER - base stats when no character with Singer in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [roxannePowerlineFan, nonSingerCharacter],
    });

    expect(testEngine.asPlayerOne().getCardStrength(roxannePowerlineFan)).toBe(
      roxannePowerlineFan.strength,
    );
    expect(testEngine.asPlayerOne().getCardLore(roxannePowerlineFan)).toBe(
      roxannePowerlineFan.lore,
    );
  });

  it("CONCERT LOVER - gets +1 {S} and +1 {L} while you have a character with Singer in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [roxannePowerlineFan, powerlineWorldsGreatestRockStar],
    });

    expect(testEngine.asPlayerOne().getCardStrength(roxannePowerlineFan)).toBe(
      roxannePowerlineFan.strength + 1,
    );
    expect(testEngine.asPlayerOne().getCardLore(roxannePowerlineFan)).toBe(
      roxannePowerlineFan.lore + 1,
    );
  });
});
