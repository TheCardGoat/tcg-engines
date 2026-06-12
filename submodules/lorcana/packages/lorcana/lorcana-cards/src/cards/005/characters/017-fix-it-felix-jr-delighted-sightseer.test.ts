import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockLocation } from "@tcg/lorcana-engine/testing";
import { fixitFelixJrDelightedSightseer } from "./017-fix-it-felix-jr-delighted-sightseer";

const mockLocation = createMockLocation({
  id: "fix-it-felix-test-location",
  name: "Test Location",
  cost: 2,
});

describe("Fix-It Felix, Jr. - Delighted Sightseer", () => {
  it("OH, MY LAND! - draws a card when played if you have a location in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [fixitFelixJrDelightedSightseer],
      play: [mockLocation],
      inkwell: fixitFelixJrDelightedSightseer.cost,
      deck: 2,
    });

    expect(
      testEngine.asPlayerOne().playCard(fixitFelixJrDelightedSightseer),
    ).toBeSuccessfulCommand();

    // The triggered ability fires and auto-resolves (mandatory draw)
    const bagCount = testEngine.asPlayerOne().getBagCount();
    for (let i = 0; i < bagCount; i++) {
      const effects = testEngine.asPlayerOne().getBagEffects();
      if (effects.length > 0) {
        testEngine.asPlayerOne().resolvePendingByCard(fixitFelixJrDelightedSightseer);
      }
    }

    expect(testEngine.asPlayerOne().getZonesCardCount()).toEqual(
      expect.objectContaining({
        hand: 1,
        deck: 1,
      }),
    );
  });

  it("OH, MY LAND! - does NOT draw a card when played if you have no location in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [fixitFelixJrDelightedSightseer],
        inkwell: fixitFelixJrDelightedSightseer.cost,
        deck: 2,
      },
      {
        play: [mockLocation],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(fixitFelixJrDelightedSightseer),
    ).toBeSuccessfulCommand();

    // No bag effects should be present (condition was not met)
    const bagCount = testEngine.asPlayerOne().getBagCount();
    for (let i = 0; i < bagCount; i++) {
      const effects = testEngine.asPlayerOne().getBagEffects();
      if (effects.length > 0) {
        testEngine.asPlayerOne().resolvePendingByCard(fixitFelixJrDelightedSightseer);
      }
    }

    expect(testEngine.asPlayerOne().getZonesCardCount()).toEqual(
      expect.objectContaining({
        hand: 0,
        deck: 2,
      }),
    );
  });
});
