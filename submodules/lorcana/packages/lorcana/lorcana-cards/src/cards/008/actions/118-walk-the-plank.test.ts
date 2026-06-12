import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { dumptruckKarnagesSecondMate } from "../characters";
import { walkThePlank } from "./118-walk-the-plank";

describe("Walk the Plank!", () => {
  it("grants your Pirate characters a temporary activated ability to banish a chosen damaged character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [walkThePlank],
        inkwell: walkThePlank.cost,
        play: [dumptruckKarnagesSecondMate],
      },
      {
        play: [simbaProtectiveCub],
      },
    );

    expect(testEngine.asServer().manualSetDamage(simbaProtectiveCub, 1)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().playCard(walkThePlank)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().activateAbility(dumptruckKarnagesSecondMate, {
        targets: [simbaProtectiveCub],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(simbaProtectiveCub)).toBe("discard");
  });

  it("regression: does not grant the ability to opponent's Pirate characters", () => {
    const opponentPirate = createMockCharacter({
      id: "wtp-opponent-pirate",
      name: "Opponent Pirate",
      cost: 3,
      strength: 3,
      willpower: 3,
      lore: 1,
      classifications: ["Storyborn", "Pirate"],
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [walkThePlank],
        inkwell: walkThePlank.cost,
        play: [{ card: dumptruckKarnagesSecondMate, isDrying: false }],
      },
      {
        play: [
          { card: opponentPirate, isDrying: false },
          { card: simbaProtectiveCub, damage: 1 },
        ],
      },
    );

    expect(testEngine.asPlayerOne().playCard(walkThePlank)).toBeSuccessfulCommand();

    // Opponent's pirate should NOT have the granted ability
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const result = testEngine.asPlayerTwo().activateAbility(opponentPirate, {
      targets: [simbaProtectiveCub],
    });
    expect(result.success).toBe(false);
  });
});
