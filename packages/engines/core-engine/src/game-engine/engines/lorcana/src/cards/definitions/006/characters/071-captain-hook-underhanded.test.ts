/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  bellwetherAssistantMayor,
  captainHookUnderhanded,
  donaldDuckFirstMate,
  jasmineRoyalSeafarer,
  wendyDarlingCourageousCaptain,
} from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Captain Hook - Underhanded", () => {
  it("INSPIRES DREAD While this character is exerted, opposing Pirate characters can't quest.", async () => {
    const testEngine = new TestEngine(
      {
        play: [
          donaldDuckFirstMate,
          wendyDarlingCourageousCaptain,
          bellwetherAssistantMayor,
        ],
      },
      {
        play: [captainHookUnderhanded],
      },
    );

    expect(
      testEngine.getCardModel(donaldDuckFirstMate).hasQuestRestriction,
    ).toBe(false);
    expect(
      testEngine.getCardModel(donaldDuckFirstMate).hasQuestRestriction,
    ).toBe(false);

    await testEngine.tapCard(captainHookUnderhanded);

    expect(
      testEngine.getCardModel(bellwetherAssistantMayor).hasQuestRestriction,
    ).toBe(false);
    expect(
      testEngine.getCardModel(donaldDuckFirstMate).hasQuestRestriction,
    ).toBe(true);
    expect(
      testEngine.getCardModel(donaldDuckFirstMate).hasQuestRestriction,
    ).toBe(true);
  });

  it("UPPER HAND Whenever this character is challenged, draw a card.", async () => {
    const testEngine = new TestEngine(
      {
        hand: [jasmineRoyalSeafarer],
      },
      {
        play: [captainHookUnderhanded],
        deck: 7,
      },
    );

    await testEngine.challenge({
      attacker: jasmineRoyalSeafarer,
      defender: captainHookUnderhanded,
      exertDefender: true,
    });

    expect(testEngine.getZonesCardCount("player_two")).toEqual(
      expect.objectContaining({
        hand: 1,
        deck: 6,
      }),
    );
  });
});
