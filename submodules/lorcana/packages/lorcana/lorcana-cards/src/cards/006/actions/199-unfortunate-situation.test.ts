import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { mickeyMouseTrueFriend, simbaProtectiveCub } from "../../001/characters";
import { unfortunateSituation } from "./199-unfortunate-situation";

describe("Unfortunate Situation", () => {
  it("lets the opponent choose one of their characters to take 4 damage", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [unfortunateSituation],
        inkwell: unfortunateSituation.cost,
      },
      {
        play: [simbaProtectiveCub, mickeyMouseTrueFriend],
      },
    );

    expect(testEngine.asPlayerOne().playCard(unfortunateSituation)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo()).toHavePendingEffectCount(1);

    expect(
      testEngine.asPlayerTwo().resolveNextPending({ targets: [simbaProtectiveCub] }).success,
    ).toBe(true);

    expect(testEngine.asPlayerTwo().getCardZone(simbaProtectiveCub)).toBe("discard");
    expect(testEngine.asPlayerTwo().getCardZone(mickeyMouseTrueFriend)).toBe("play");
  });

  it("regression: should work at all - dealing 4 damage to a character chosen by opponent", () => {
    // Bug: Unfortunate Situation was not working at all.
    // Verify the basic flow: play the card, opponent chooses, damage is dealt.
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [unfortunateSituation],
        inkwell: unfortunateSituation.cost,
      },
      {
        play: [mickeyMouseTrueFriend],
      },
    );

    expect(testEngine.asPlayerOne().playCard(unfortunateSituation)).toBeSuccessfulCommand();

    // Opponent should have a pending effect to choose a character
    expect(testEngine.asPlayerTwo()).toHavePendingEffectCount(1);

    expect(
      testEngine.asPlayerTwo().resolveNextPending({ targets: [mickeyMouseTrueFriend] }).success,
    ).toBe(true);

    // Mickey (willpower 2) should take 4 damage and be banished
    expect(testEngine.asPlayerTwo().getCardZone(mickeyMouseTrueFriend)).toBe("discard");
  });
});
