import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { holdStill } from "../actions/028-hold-still";
import { grandPabbieOldestAndWisest } from "./148-grand-pabbie-oldest-and-wisest";
import { healingGlow } from "../../001/actions/028-healing-glow";

describe("Grand Pabbie - Oldest and Wisest", () => {
  it("is no longer marked as missing executable coverage", () => {
    expect(grandPabbieOldestAndWisest.missingImplementation).toBeUndefined();
    expect(grandPabbieOldestAndWisest.missingTests).toBeUndefined();
  });

  it("ANCIENT INSIGHT - does NOT gain lore when the opponent removes damage from one of your characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [grandPabbieOldestAndWisest],
        deck: 3,
      },
      {
        hand: [healingGlow],
        inkwell: healingGlow.cost,
        deck: 2,
      },
    );

    testEngine.asServer().manualSetDamage(grandPabbieOldestAndWisest, 2);
    const loreBefore = testEngine.getLore(PLAYER_ONE);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    // Opponent plays Healing Glow on player one's Grand Pabbie
    expect(
      testEngine.asPlayerTwo().playCard(healingGlow, {
        targets: [grandPabbieOldestAndWisest],
      }),
    ).toBeSuccessfulCommand();

    // Grand Pabbie should NOT have gained lore
    expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore);
  });

  it("gains 2 lore when damage is removed from one of your characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [grandPabbieOldestAndWisest],
        hand: [holdStill],
        inkwell: 2,
        deck: 3,
      },
      { deck: 2 },
    );

    testEngine.asServer().manualSetDamage(grandPabbieOldestAndWisest, 2);
    const loreBefore = testEngine.getLore(PLAYER_ONE);

    expect(
      testEngine.asPlayerOne().playCard(holdStill, {
        targets: [grandPabbieOldestAndWisest],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getDamage(grandPabbieOldestAndWisest)).toBe(0);
    expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore + 2);
  });
});
