import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { rahr } from "./136-rahr";

const rahrTarget = createMockCharacter({
  id: "rahr-target",
  name: "RAHR Target",
  cost: 2,
  strength: 2,
});

describe("RAHR!", () => {
  it("gives chosen character +3 strength this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [rahr],
      inkwell: rahr.cost,
      play: [rahrTarget],
    });

    expect(
      testEngine.asPlayerOne().playCard(rahr, {
        targets: [rahrTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.getCard(rahrTarget).strength).toBe(5);
  });
});
