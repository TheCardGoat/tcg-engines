import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { youBrokeMySmolder } from "./201-you-broke-my-smolder";

const smolderFodder = createMockCharacter({
  id: "you-broke-my-smolder-fodder",
  name: "Fodder",
  cost: 1,
});
const smolderDrawA = createMockCharacter({
  id: "you-broke-my-smolder-draw-a",
  name: "Draw A",
  cost: 1,
});
const smolderDrawB = createMockCharacter({
  id: "you-broke-my-smolder-draw-b",
  name: "Draw B",
  cost: 1,
});

describe("You Broke My Smolder", () => {
  it("discards your hand and draws 2 cards", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [youBrokeMySmolder, smolderFodder],
      inkwell: youBrokeMySmolder.cost,
      deck: [smolderDrawA, smolderDrawB],
    });

    expect(testEngine.asPlayerOne().playCard(youBrokeMySmolder)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(smolderFodder)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(smolderDrawA)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(smolderDrawB)).toBe("hand");
  });
});
