import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { mickeyMouseTrueFriend, simbaProtectiveCub } from "../characters";
import { fryingPan } from "./202-frying-pan";

describe("Frying Pan", () => {
  it("banishes itself and stops the chosen character from challenging during their next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [fryingPan, { card: simbaProtectiveCub, exerted: true }],
        deck: 2,
      },
      {
        play: [mickeyMouseTrueFriend],
        deck: 2,
      },
    );

    const result = testEngine.asPlayerOne().activateAbility(fryingPan, {
      ability: "CLANG!",
      targets: [mickeyMouseTrueFriend],
    });

    expect(result).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(fryingPan)).toBe("discard");

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo()).toHaveRestriction({
      card: mickeyMouseTrueFriend,
      restriction: "cant-challenge",
    });
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo()).not.toHaveRestriction({
      card: mickeyMouseTrueFriend,
      restriction: "cant-challenge",
    });
  });
});
