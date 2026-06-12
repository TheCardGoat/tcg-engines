import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { donaldDuckNotAgain, goofyKnightForADay, tianaCelebratingPrincess } from "../characters";
import { teethAndAmbitions } from "./130-teeth-and-ambitions";

describe("Teeth and Ambitions", () => {
  it("deals 2 damage to your chosen character and then to another chosen character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [teethAndAmbitions],
        inkwell: teethAndAmbitions.cost,
        play: [goofyKnightForADay],
      },
      {
        play: [donaldDuckNotAgain],
      },
    );
    const ownTargetId = testEngine.findCardInstanceId(goofyKnightForADay, "play", "p1");
    const opposingTargetId = testEngine.findCardInstanceId(donaldDuckNotAgain, "play", "p2");

    expect(
      testEngine.asPlayerOne().playCard(teethAndAmbitions, {
        targets: [ownTargetId, opposingTargetId],
      }).success,
    ).toBe(true);

    expect(testEngine.getBoard("authoritative").cards[ownTargetId].damage).toBe(2);
    expect(testEngine.getBoard("authoritative").cards[opposingTargetId].damage).toBe(2);
  });

  it("does not deal the second damage when the first damage is fully prevented", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [teethAndAmbitions],
        inkwell: teethAndAmbitions.cost,
        play: [tianaCelebratingPrincess],
      },
      {
        play: [donaldDuckNotAgain],
      },
    );
    const preventedTargetId = testEngine.findCardInstanceId(tianaCelebratingPrincess, "play", "p1");
    const opposingTargetId = testEngine.findCardInstanceId(donaldDuckNotAgain, "play", "p2");

    expect(
      testEngine.asPlayerOne().playCard(teethAndAmbitions, {
        targets: [preventedTargetId, opposingTargetId],
      }).success,
    ).toBe(true);

    expect(testEngine.getBoard("authoritative").cards[preventedTargetId].damage).toBe(0);
    expect(testEngine.getBoard("authoritative").cards[opposingTargetId].damage).toBe(0);
  });
});
