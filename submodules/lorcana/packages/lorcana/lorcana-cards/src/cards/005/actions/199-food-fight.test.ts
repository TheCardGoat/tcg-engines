import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { arthurNoviceSparrow } from "../characters";
import { foodFight } from "./199-food-fight";

const secondCharacter = createMockCharacter({
  id: "food-fight-second-char",
  name: "Second Character",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Food Fight!", () => {
  it("grants your characters a temporary activated ability to deal 1 damage to a chosen character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [foodFight],
        inkwell: 2,
        play: [arthurNoviceSparrow],
      },
      {
        play: [simbaProtectiveCub],
      },
    );

    expect(testEngine.asPlayerOne().playCard(foodFight)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().hasTemporaryAbility(arthurNoviceSparrow, "food-fight-damage"),
    ).toBe(true);

    expect(
      testEngine.asPlayerOne().activateAbility(arthurNoviceSparrow, {
        targets: [simbaProtectiveCub],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(arthurNoviceSparrow)).toBe(true);
    expect(testEngine.asPlayerTwo()).toHaveDamage({ card: simbaProtectiveCub, value: 1 });
  });

  it("grants the ability to multiple characters and each can independently activate", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [foodFight],
        inkwell: 4,
        play: [arthurNoviceSparrow, secondCharacter],
      },
      {
        play: [simbaProtectiveCub],
      },
    );

    expect(testEngine.asPlayerOne().playCard(foodFight)).toBeSuccessfulCommand();

    // Both characters should have the granted ability
    expect(
      testEngine.asPlayerOne().hasTemporaryAbility(arthurNoviceSparrow, "food-fight-damage"),
    ).toBe(true);
    expect(testEngine.asPlayerOne().hasTemporaryAbility(secondCharacter, "food-fight-damage")).toBe(
      true,
    );

    // First character activates
    expect(
      testEngine.asPlayerOne().activateAbility(arthurNoviceSparrow, {
        targets: [simbaProtectiveCub],
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo()).toHaveDamage({ card: simbaProtectiveCub, value: 1 });

    // Second character also activates independently
    expect(
      testEngine.asPlayerOne().activateAbility(secondCharacter, {
        targets: [simbaProtectiveCub],
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo()).toHaveDamage({ card: simbaProtectiveCub, value: 2 });
  });
});
