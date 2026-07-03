import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { gopherHunnyCook } from "./078-gopher-hunny-cook";

const hunnyAlly = createMockCharacter({
  id: "gopher-hunny-cook-hunny-ally",
  name: "Hunny Ally",
  cost: 2,
  classifications: ["Storyborn", "Ally", "Hunny"],
});

const nonHunnyAlly = createMockCharacter({
  id: "gopher-hunny-cook-non-hunny-ally",
  name: "Non-Hunny Ally",
  cost: 2,
  classifications: ["Storyborn", "Ally"],
});

describe("Gopher - Hunny Cook", () => {
  it("may enter play exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [gopherHunnyCook],
      inkwell: gopherHunnyCook.cost,
    });

    expect(
      testEngine.asPlayerOne().playCard(gopherHunnyCook, { resolveOptional: true }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(gopherHunnyCook)).toBe(true);
  });

  it("gives your other Hunny characters Resist +1 during an opponent's turn while exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: gopherHunnyCook, exerted: true }, hunnyAlly],
    });

    expect(testEngine.asPlayerOne().getKeywordValue(hunnyAlly, "Resist")).toBe(null);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getKeywordValue(hunnyAlly, "Resist")).toBe(1);
  });

  it("does not give Resist to itself, non-Hunny characters, or while ready", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [gopherHunnyCook, hunnyAlly, nonHunnyAlly],
    });

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getKeywordValue(gopherHunnyCook, "Resist")).toBe(null);
    expect(testEngine.asPlayerOne().getKeywordValue(hunnyAlly, "Resist")).toBe(null);
    expect(testEngine.asPlayerOne().getKeywordValue(nonHunnyAlly, "Resist")).toBe(null);
  });
});
