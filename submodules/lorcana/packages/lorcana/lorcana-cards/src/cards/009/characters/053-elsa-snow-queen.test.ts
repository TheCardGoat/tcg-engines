import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { elsaSnowQueen } from "./053-elsa-snow-queen";

const opposingCharacter = createMockCharacter({
  id: "elsa-snow-queen-target",
  name: "Opposing Character",
  cost: 3,
});

describe("Elsa - Snow Queen", () => {
  it("FREEZE {E} — exerts chosen opposing character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: elsaSnowQueen, isDrying: false }],
        deck: 1,
      },
      {
        play: [opposingCharacter],
        deck: 1,
      },
    );

    expect(testEngine.asPlayerTwo().getCard(opposingCharacter).exerted).toBe(false);

    expect(
      testEngine.asPlayerOne().activateAbility(elsaSnowQueen, {
        targets: [opposingCharacter],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(elsaSnowQueen)).toBe(true);
    expect(testEngine.asPlayerTwo().getCard(opposingCharacter).exerted).toBe(true);
  });
});
