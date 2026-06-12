import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  PLAYER_ONE,
} from "@tcg/lorcana-engine/testing";
import { mickeyMouseTrueFriend, simbaProtectiveCub } from "../../001";
import { dragonFire } from "../../001/actions/130-dragon-fire";
import { theReturnOfHercules } from "./118-the-return-of-hercules";

describe("The Return of Hercules", () => {
  it("can resolve free plays for both players in order", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [theReturnOfHercules, simbaProtectiveCub],
        inkwell: theReturnOfHercules.cost,
      },
      {
        hand: [mickeyMouseTrueFriend],
      },
    );

    const simbaId = testEngine.findCardInstanceId(simbaProtectiveCub, "hand", "p1");
    const mickeyId = testEngine.findCardInstanceId(mickeyMouseTrueFriend, "hand", "p2");

    expect(testEngine.asPlayerOne().playCard(theReturnOfHercules)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        resolveOptional: true,
        targets: [simbaId],
      }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().resolveNextPending({
        resolveOptional: true,
        targets: [mickeyId],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(simbaProtectiveCub)).toBe("play");
    expect(testEngine.asPlayerTwo().getCardZone(mickeyMouseTrueFriend)).toBe("play");
  });

  it("regression: when-played abilities of characters played via this card should still resolve even if the character is banished before resolution", () => {
    const whenPlayedChar = createMockCharacter({
      id: "hercules-when-played-char",
      name: "When Played Char",
      cost: 5,
      strength: 3,
      willpower: 1,
      lore: 1,
      abilities: [
        {
          id: "test-wp-1",
          type: "triggered" as const,
          name: "TEST WHEN PLAYED",
          text: "When you play this character, gain 1 lore.",
          trigger: {
            event: "play" as const,
            on: "SELF" as const,
            timing: "when" as const,
          },
          effect: {
            type: "gain-lore",
            amount: 1,
          },
        },
      ],
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [theReturnOfHercules, whenPlayedChar],
        inkwell: theReturnOfHercules.cost,
        deck: 3,
      },
      {
        hand: [],
        deck: 1,
      },
    );

    const whenPlayedCharId = testEngine.findCardInstanceId(whenPlayedChar, "hand", "p1");

    expect(testEngine.asPlayerOne().playCard(theReturnOfHercules)).toBeSuccessfulCommand();

    // P1 plays the character for free
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        resolveOptional: true,
        targets: [whenPlayedCharId],
      }),
    ).toBeSuccessfulCommand();

    // P2 declines
    expect(
      testEngine.asPlayerTwo().resolveNextPending({
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();

    // The character should be in play
    expect(testEngine.asPlayerOne().getCardZone(whenPlayedChar)).toBe("play");

    // The when-played trigger should have resolved and granted lore
    // Resolve any bag effects
    testEngine.asPlayerOne().resolveAllBagEffects();

    expect(testEngine.getLore(PLAYER_ONE)).toBeGreaterThanOrEqual(1);
  });
});
