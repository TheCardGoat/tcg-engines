import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { darkwingDuckDrakeMallard } from "../characters";
import { blueSmoke } from "./166-blue-smoke";

const wardTarget = createMockCharacter({
  id: "blue-smoke-ward-target",
  name: "Ward Target",
  cost: 2,
});

describe("Blue Smoke", () => {
  it("costs 1 less to play when you have a character named Darkwing Duck in play", () => {
    const discountedEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [blueSmoke],
      inkwell: 0,
      play: [darkwingDuckDrakeMallard],
      deck: 2,
    });

    expect(discountedEngine.asPlayerOne().playCard(blueSmoke)).toBeSuccessfulCommand();

    const fullPriceEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [blueSmoke],
      inkwell: 0,
      deck: 2,
    });

    expect(fullPriceEngine.asPlayerOne().playCard(blueSmoke).success).toBe(false);
  });

  it("banishes itself to give the chosen character Ward until the start of your next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 2,
        inkwell: 1,
        play: [blueSmoke, wardTarget],
      },
      {
        deck: 2,
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(blueSmoke, {
        ability: "CLOUD OF MYSTERY",
        targets: [wardTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(blueSmoke)).toBe("discard");
    expect(testEngine.asPlayerOne().hasKeyword(wardTarget, "Ward")).toBe(true);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().hasKeyword(wardTarget, "Ward")).toBe(true);

    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().hasKeyword(wardTarget, "Ward")).toBe(false);
  });
});
