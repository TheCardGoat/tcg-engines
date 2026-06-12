import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { donaldDuckMusketeer, simbaProtectiveCub } from "../../001";
import { nearlyIndestructible } from "./200-nearly-indestructible";

describe("Nearly Indestructible", () => {
  it("grants Resist +2 through the opponent's turn and removes it at the start of your next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [nearlyIndestructible],
        inkwell: nearlyIndestructible.cost,
        deck: [simbaProtectiveCub, simbaProtectiveCub],
        play: [simbaProtectiveCub],
      },
      {
        deck: [simbaProtectiveCub, simbaProtectiveCub],
      },
    );

    expect(testEngine.asPlayerOne().getKeywordValue(simbaProtectiveCub, "Resist")).toBe(null);
    expect(
      testEngine.asPlayerOne().playCard(nearlyIndestructible, {
        targets: [simbaProtectiveCub],
      }).success,
    ).toBe(true);
    expect(testEngine.asPlayerOne().getKeywordValue(simbaProtectiveCub, "Resist")).toBe(2);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getKeywordValue(simbaProtectiveCub, "Resist")).toBe(2);

    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getKeywordValue(simbaProtectiveCub, "Resist")).toBe(null);
  });

  it("reduces challenge damage by 2 while the effect is active", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [nearlyIndestructible],
        inkwell: nearlyIndestructible.cost,
        deck: [simbaProtectiveCub, simbaProtectiveCub],
        play: [simbaProtectiveCub],
      },
      {
        deck: [donaldDuckMusketeer, donaldDuckMusketeer],
        play: [donaldDuckMusketeer],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(nearlyIndestructible, {
        targets: [simbaProtectiveCub],
      }).success,
    ).toBe(true);
    expect(testEngine.asServer().manualExertCard(simbaProtectiveCub)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().canChallenge(donaldDuckMusketeer, simbaProtectiveCub)).toBe(
      true,
    );
    expect(
      testEngine.asPlayerTwo().challenge(donaldDuckMusketeer, simbaProtectiveCub).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getDamage(simbaProtectiveCub)).toBe(0);
  });
});
