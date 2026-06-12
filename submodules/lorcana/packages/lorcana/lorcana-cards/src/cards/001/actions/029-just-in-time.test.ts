import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { captainColonelsLieutenant, simbaProtectiveCub, teKTheBurningOne } from "../characters";
import { justInTime } from "./029-just-in-time";

describe("Just in Time", () => {
  it("plays a character with cost 5 or less for free", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [justInTime, captainColonelsLieutenant],
      inkwell: justInTime.cost,
    });
    const captainId = testEngine.findCardInstanceId(captainColonelsLieutenant, "hand", "p1");

    expect(
      testEngine.asPlayerOne().playCard(justInTime, {
        resolveOptional: true,
        targets: [captainId],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(justInTime)).toEqual("discard");
    expect(testEngine.asPlayerOne().getCardZone(captainColonelsLieutenant)).toEqual("play");
  });

  it("lets a Bodyguard character enter play exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [justInTime, simbaProtectiveCub],
      inkwell: justInTime.cost,
    });
    const simbaId = testEngine.findCardInstanceId(simbaProtectiveCub, "hand", "p1");

    expect(
      testEngine.asPlayerOne().playCard(justInTime, {
        resolveOptional: true,
        enterPlayExerted: true,
        targets: [simbaId],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(simbaProtectiveCub)).toEqual("play");
    expect(testEngine.asPlayerOne().isExerted(simbaProtectiveCub)).toEqual(true);
  });

  it("lets a Bodyguard character enter play ready from the pending free-play prompt", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [justInTime, simbaProtectiveCub],
      inkwell: justInTime.cost,
    });
    const simbaId = testEngine.findCardInstanceId(simbaProtectiveCub, "hand", "p1");

    expect(testEngine.asPlayerOne().playCard(justInTime)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        resolveOptional: true,
        targets: [simbaId],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(justInTime)).toEqual("discard");
    expect(testEngine.asPlayerOne().getCardZone(simbaProtectiveCub)).toEqual("play");
    expect(testEngine.asPlayerOne().isExerted(simbaProtectiveCub)).toEqual(false);
  });

  it("lets a Bodyguard character enter play exerted from the pending free-play prompt", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [justInTime, simbaProtectiveCub],
      inkwell: justInTime.cost,
    });
    const simbaId = testEngine.findCardInstanceId(simbaProtectiveCub, "hand", "p1");

    expect(testEngine.asPlayerOne().playCard(justInTime)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        resolveOptional: true,
        enterPlayExerted: true,
        targets: [simbaId],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(justInTime)).toEqual("discard");
    expect(testEngine.asPlayerOne().getCardZone(simbaProtectiveCub)).toEqual("play");
    expect(testEngine.asPlayerOne().isExerted(simbaProtectiveCub)).toEqual(true);
  });

  it("does not play a character with cost greater than 5 for free", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [justInTime, teKTheBurningOne],
      inkwell: justInTime.cost,
    });
    const teKaId = testEngine.findCardInstanceId(teKTheBurningOne, "hand", "p1");

    expect(testEngine.asPlayerOne().playCard(justInTime)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        resolveOptional: true,
        targets: [teKaId],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(justInTime)).toEqual("discard");
    expect(testEngine.asPlayerOne().getCardZone(teKTheBurningOne)).toEqual("hand");
  });

  it("can decline the optional free play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [justInTime, captainColonelsLieutenant],
      inkwell: justInTime.cost,
    });
    const captainId = testEngine.findCardInstanceId(captainColonelsLieutenant, "hand", "p1");

    expect(
      testEngine.asPlayerOne().playCard(justInTime, {
        resolveOptional: false,
        targets: [captainId],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(justInTime)).toEqual("discard");
    expect(testEngine.asPlayerOne().getCardZone(captainColonelsLieutenant)).toEqual("hand");
  });
});
