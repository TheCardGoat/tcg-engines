import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { painRunningWithScissors } from "./048-pain-running-with-scissors";

const panicInDiscard = createMockCharacter({
  id: "pain-running-with-scissors-panic",
  name: "Panic",
  cost: 2,
});

describe("Pain - Running with Scissors", () => {
  it("gains 2 lore when Panic is in your discard as Pain is played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [painRunningWithScissors],
      discard: [panicInDiscard],
      inkwell: painRunningWithScissors.cost,
    });

    expect(testEngine.asPlayerOne().playCard(painRunningWithScissors)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(2);
  });
});
