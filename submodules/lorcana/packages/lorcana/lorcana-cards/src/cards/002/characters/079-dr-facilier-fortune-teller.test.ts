import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { drFacilierFortuneTeller } from "./079-dr-facilier-fortune-teller";
import { goofyKnightForADay } from "./180-goofy-knight-for-a-day";

describe("Dr. Facilier - Fortune Teller", () => {
  it("Evasive", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [drFacilierFortuneTeller],
      deck: 1,
    });

    expect(testEngine.hasKeyword(drFacilierFortuneTeller, "Evasive")).toBe(true);
  });

  it("YOU'RE IN MY WORLD - Whenever this character quests, chosen opposing character can't quest during their next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [drFacilierFortuneTeller],
        deck: 1,
      },
      {
        play: [goofyKnightForADay],
        deck: 1,
      },
    );

    const facilierInstanceId = testEngine.findCardInstanceId(
      drFacilierFortuneTeller,
      "play",
      "player_one",
    );
    const targetInstanceId = testEngine.findCardInstanceId(
      goofyKnightForADay,
      "play",
      "player_two",
    );

    // Card quests and triggers the ability
    expect(testEngine.asPlayerOne().quest(facilierInstanceId)).toBeSuccessfulCommand();

    // Verify the bag item was queued
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    // Resolve the triggered ability with target selection
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(drFacilierFortuneTeller, {
        targets: [targetInstanceId],
      }),
    ).toBeSuccessfulCommand();

    // During player one's turn, restriction is NOT active yet (starts on opponent's next turn)
    expect(testEngine.hasRestriction(goofyKnightForADay, "cant-quest")).toBe(false);

    // Pass turn to opponent's next turn
    testEngine.asServer().passTurn();

    // During opponent's next turn, the chosen character should have the cant-quest restriction
    expect(testEngine.hasRestriction(goofyKnightForADay, "cant-quest")).toBe(true);

    // Verify Goofy cannot quest during this turn
    expect(testEngine.asPlayerTwo().quest(targetInstanceId)).not.toBeSuccessfulCommand();
  });
});
