import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { shieldOfArendelle } from "./200-shield-of-arendelle";

const shieldBearer = createMockCharacter({
  id: "shield-of-arendelle-target",
  name: "Shield Bearer",
  cost: 2,
});

describe("Shield of Arendelle", () => {
  it("gives the chosen character Resist +1 until the start of your next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 2,
        play: [shieldOfArendelle, shieldBearer],
      },
      {
        deck: 2,
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(shieldOfArendelle, {
        targets: [shieldBearer],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getKeywordValue(shieldBearer, "Resist")).toBe(1);
    expect(testEngine.asPlayerOne().getCardZone(shieldOfArendelle)).toBe("discard");

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getKeywordValue(shieldBearer, "Resist")).toBe(1);

    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getKeywordValue(shieldBearer, "Resist")).toBeNull();
  });
});
