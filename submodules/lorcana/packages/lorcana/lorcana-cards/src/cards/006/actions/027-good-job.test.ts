import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { goodJob } from "./027-good-job";

const targetCharacter = createMockCharacter({
  id: "good-job-target",
  name: "Good Job Target",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

describe("Good Job!", () => {
  it("gives the chosen character +1 lore this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [goodJob],
      inkwell: goodJob.cost,
      play: [targetCharacter],
    });

    expect(testEngine.asPlayerOne().playCardTo(goodJob, targetCharacter)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardLore(targetCharacter)).toBe(targetCharacter.lore + 1);
  });

  it("removes the lore bonus at the end of the turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [goodJob],
        inkwell: goodJob.cost,
        play: [targetCharacter],
      },
      {
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().playCardTo(goodJob, targetCharacter)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardLore(targetCharacter)).toBe(targetCharacter.lore + 1);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardLore(targetCharacter)).toBe(targetCharacter.lore);
  });
});
