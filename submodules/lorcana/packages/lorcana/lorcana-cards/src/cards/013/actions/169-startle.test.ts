import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { startle } from "./169-startle";

const startleTarget = createMockCharacter({
  id: "startle-target",
  name: "Startle Target",
  cost: 2,
  strength: 4,
});

describe("Startle", () => {
  it("gives chosen character -3 strength this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [startle],
      inkwell: startle.cost,
      play: [startleTarget],
    });

    expect(
      testEngine.asPlayerOne().playCard(startle, {
        targets: [startleTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.getCard(startleTarget).strength).toBe(1);
  });
});
