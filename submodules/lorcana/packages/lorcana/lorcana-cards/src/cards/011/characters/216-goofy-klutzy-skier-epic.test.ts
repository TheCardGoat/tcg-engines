import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { goofyKlutzySkierEpic } from "./216-goofy-klutzy-skier-epic";

const chosenCharacter = createMockCharacter({
  id: "goofy-klutzy-skier-epic-target",
  name: "Chosen Character",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
});

describe("Goofy - Klutzy Skier - Epic", () => {
  it("exerts and banishes itself to banish the chosen character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [goofyKlutzySkierEpic],
      },
      {
        play: [chosenCharacter],
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(goofyKlutzySkierEpic, {
        targets: [chosenCharacter],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(goofyKlutzySkierEpic)).toBe("discard");
    expect(testEngine.asPlayerTwo().getCardZone(chosenCharacter)).toBe("discard");
  });
});
