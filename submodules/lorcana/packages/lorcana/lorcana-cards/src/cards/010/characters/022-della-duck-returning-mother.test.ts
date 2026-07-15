import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { arielEtherealVoice } from "./017-ariel-ethereal-voice";
import { dellaDuckReturningMother } from "./022-della-duck-returning-mother";

describe("Della Duck - Returning Mother", () => {
  it("HERE TO HELP - readies a chosen character with Boost and stops them from questing or challenging this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [dellaDuckReturningMother],
      inkwell: dellaDuckReturningMother.cost,
      play: [{ card: arielEtherealVoice, exerted: true }],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().playCard(dellaDuckReturningMother)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(dellaDuckReturningMother, {
        resolveOptional: true,
        targets: [arielEtherealVoice],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(arielEtherealVoice)).toBe(false);
    expect(testEngine.asPlayerOne()).toHaveRestriction({
      card: arielEtherealVoice,
      restriction: "cant-quest",
    });
    expect(testEngine.asPlayerOne()).toHaveRestriction({
      card: arielEtherealVoice,
      restriction: "cant-challenge",
    });
  });

  it("can decline HERE TO HELP", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [dellaDuckReturningMother],
      inkwell: dellaDuckReturningMother.cost,
      play: [{ card: arielEtherealVoice, exerted: true }],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().playCard(dellaDuckReturningMother)).toBeSuccessfulCommand();
    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(dellaDuckReturningMother, { resolveOptional: false }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(arielEtherealVoice)).toBe(true);
    expect(testEngine.hasRestriction(arielEtherealVoice, "cant-quest")).toBe(false);
    expect(testEngine.hasRestriction(arielEtherealVoice, "cant-challenge")).toBe(false);
  });
});
