import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { jollyRogerHooksShip } from "./135-jolly-roger-hooks-ship";

const pirateCrew = createMockCharacter({
  id: "jolly-pirate-crew",
  name: "Pirate Crew",
  cost: 2,
  classifications: ["Storyborn", "Pirate"],
});

describe("Jolly Roger - Hook's Ship", () => {
  it("lets Pirate characters move here for free and gives characters here Rush", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [jollyRogerHooksShip, pirateCrew],
    });

    expect(
      testEngine.asPlayerOne().moveCharacterToLocation(pirateCrew, jollyRogerHooksShip).success,
    ).toBe(true);
    expect(testEngine.asPlayerOne().getCard(pirateCrew)?.hasRush).toBe(true);
  });
});
