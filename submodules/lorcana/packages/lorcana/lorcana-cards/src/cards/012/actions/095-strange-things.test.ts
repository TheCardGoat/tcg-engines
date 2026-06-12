import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { strangeThings } from "./095-strange-things";

const target1 = createMockCharacter({
  id: "strange-things-target1",
  name: "Target One",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const target2 = createMockCharacter({
  id: "strange-things-target2",
  name: "Target Two",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Strange Things", () => {
  it("prevents up to 2 chosen characters from questing until the start of your next turn, and draws a card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [strangeThings],
        inkwell: strangeThings.cost,
        deck: 10,
      },
      {
        play: [target1, target2],
        deck: 10,
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(strangeThings, {
        targets: [target1, target2],
      }),
    ).toBeSuccessfulCommand();

    // Drew a card
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);

    // Opponent cannot quest with either chosen character this turn
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().quest(target1).success).toBe(false);
    expect(testEngine.asPlayerTwo().quest(target2).success).toBe(false);

    // After player one's next turn starts, restriction is lifted
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().quest(target1).success).toBe(true);
    expect(testEngine.asPlayerTwo().quest(target2).success).toBe(true);
  });

  it("can target a single character (up to 2)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [strangeThings],
        inkwell: strangeThings.cost,
        deck: 10,
      },
      {
        play: [target1, target2],
        deck: 10,
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(strangeThings, {
        targets: [target1],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().quest(target1).success).toBe(false);
    // Un-targeted character can still quest
    expect(testEngine.asPlayerTwo().quest(target2).success).toBe(true);
  });
});
