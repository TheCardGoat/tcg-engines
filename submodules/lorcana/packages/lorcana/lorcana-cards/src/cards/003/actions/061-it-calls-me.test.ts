import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { aladdinPrinceAli, arielOnHumanLegs, healingGlow, simbaProtectiveCub } from "../../001";
import { itCallsMe } from "./061-it-calls-me";

describe("It Calls Me", () => {
  it("draws a card and shuffles up to 3 chosen cards from the opponent's discard into their deck", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [itCallsMe],
        inkwell: itCallsMe.cost,
        deck: [aladdinPrinceAli],
      },
      {
        discard: [arielOnHumanLegs, healingGlow, simbaProtectiveCub],
      },
    );
    const arielId = testEngine.findCardInstanceId(arielOnHumanLegs, "discard", PLAYER_TWO);
    const healingGlowId = testEngine.findCardInstanceId(healingGlow, "discard", PLAYER_TWO);
    const simbaId = testEngine.findCardInstanceId(simbaProtectiveCub, "discard", PLAYER_TWO);

    expect(
      testEngine.asPlayerOne().playCard(itCallsMe, {
        playerTargets: PLAYER_TWO,
        targets: [arielId, healingGlowId, simbaId],
      }).success,
    ).toBe(true);

    expect(testEngine.getCardInstanceIdsInZone("discard", PLAYER_TWO)).toHaveLength(0);
    expect(testEngine.getCardInstanceIdsInZone("deck", PLAYER_TWO)).toEqual(
      expect.arrayContaining([arielId, healingGlowId, simbaId]),
    );
    expect(testEngine.asPlayerOne().getCardZone(aladdinPrinceAli)).toBe("hand");
  });

  it("still draws a card when the opponent has no cards in discard", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [itCallsMe],
        inkwell: itCallsMe.cost,
        deck: [aladdinPrinceAli],
      },
      {
        deck: 5,
      },
    );

    expect(testEngine.asPlayerOne().playCard(itCallsMe)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(aladdinPrinceAli)).toBe("hand");
  });
});
