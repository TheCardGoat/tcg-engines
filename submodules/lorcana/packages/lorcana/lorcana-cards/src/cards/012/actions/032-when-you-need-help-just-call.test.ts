import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import {
  aladdinCorneredSwordsman,
  captainColonelsLieutenant,
  hansThirteenthInLine,
} from "../../001/characters";
import { whenYouNeedHelpJustCall } from "./032-when-you-need-help-just-call";

describe("When You Need Help, Just Call", () => {
  it("plays a character with cost 4 or less for free when an opponent has more characters in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [whenYouNeedHelpJustCall, hansThirteenthInLine],
        inkwell: whenYouNeedHelpJustCall.cost,
      },
      {
        play: [aladdinCorneredSwordsman, aladdinCorneredSwordsman],
      },
    );

    const hansId = testEngine.findCardInstanceId(hansThirteenthInLine, "hand", "p1");

    expect(
      testEngine.asPlayerOne().playCard(whenYouNeedHelpJustCall, {
        resolveOptional: true,
        targets: [hansId],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(whenYouNeedHelpJustCall)).toEqual("discard");
    expect(testEngine.asPlayerOne().getCardZone(hansThirteenthInLine)).toEqual("play");
  });

  it("does nothing when the opponent does not have more characters than you", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [whenYouNeedHelpJustCall, hansThirteenthInLine],
        play: [aladdinCorneredSwordsman],
        inkwell: whenYouNeedHelpJustCall.cost,
      },
      {
        play: [aladdinCorneredSwordsman],
      },
    );

    expect(testEngine.asPlayerOne().playCard(whenYouNeedHelpJustCall)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(whenYouNeedHelpJustCall)).toEqual("discard");
    expect(testEngine.asPlayerOne().getCardZone(hansThirteenthInLine)).toEqual("hand");
  });

  it("does not play characters with cost greater than 4 for free", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [whenYouNeedHelpJustCall, captainColonelsLieutenant],
        inkwell: whenYouNeedHelpJustCall.cost,
      },
      {
        play: [aladdinCorneredSwordsman, aladdinCorneredSwordsman],
      },
    );

    const captainId = testEngine.findCardInstanceId(captainColonelsLieutenant, "hand", "p1");

    expect(testEngine.asPlayerOne().playCard(whenYouNeedHelpJustCall)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        resolveOptional: true,
        targets: [captainId],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(whenYouNeedHelpJustCall)).toEqual("discard");
    expect(testEngine.asPlayerOne().getCardZone(captainColonelsLieutenant)).toEqual("hand");
  });
});
