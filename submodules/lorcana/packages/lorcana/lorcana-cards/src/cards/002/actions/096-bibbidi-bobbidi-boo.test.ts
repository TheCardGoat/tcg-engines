import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { donaldDuckBoisterousFowl, tamatoaDrabLittleCrab } from "../../001";
import { cheshireCatAlwaysGrinning, flynnRiderConfidentVagabond } from "../characters";
import { bibbidiBobbidiBoo } from "./096-bibbidi-bobbidi-boo";

describe("Bibbidi Bobbidi Boo", () => {
  it("returns your chosen character to play a character with the same cost for free", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [bibbidiBobbidiBoo, cheshireCatAlwaysGrinning],
      inkwell: bibbidiBobbidiBoo.cost,
      play: [tamatoaDrabLittleCrab],
    });
    const returnId = testEngine.findCardInstanceId(tamatoaDrabLittleCrab, "play", "p1");
    const playId = testEngine.findCardInstanceId(cheshireCatAlwaysGrinning, "hand", "p1");

    expect(
      testEngine.asPlayerOne().playCard(bibbidiBobbidiBoo, {
        targets: [returnId, playId],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getCardZone(returnId)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(playId)).toBe("play");
  });

  it("returns your chosen character to play a lower-cost character for free", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [bibbidiBobbidiBoo, flynnRiderConfidentVagabond],
      inkwell: bibbidiBobbidiBoo.cost,
      play: [cheshireCatAlwaysGrinning],
    });
    const returnId = testEngine.findCardInstanceId(cheshireCatAlwaysGrinning, "play", "p1");
    const playId = testEngine.findCardInstanceId(flynnRiderConfidentVagabond, "hand", "p1");

    expect(
      testEngine.asPlayerOne().playCard(bibbidiBobbidiBoo, {
        targets: [returnId, playId],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getCardZone(returnId)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(playId)).toBe("play");
  });

  it("allows a different ink type character with the same cost", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [bibbidiBobbidiBoo, donaldDuckBoisterousFowl],
      inkwell: bibbidiBobbidiBoo.cost,
      play: [tamatoaDrabLittleCrab],
    });
    const returnId = testEngine.findCardInstanceId(tamatoaDrabLittleCrab, "play", "p1");
    const playId = testEngine.findCardInstanceId(donaldDuckBoisterousFowl, "hand", "p1");

    expect(
      testEngine.asPlayerOne().playCard(bibbidiBobbidiBoo, {
        targets: [returnId, playId],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getCardZone(returnId)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(playId)).toBe("play");
  });

  it("does not play a higher-cost character or replay the returned character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [bibbidiBobbidiBoo, cheshireCatAlwaysGrinning],
      inkwell: bibbidiBobbidiBoo.cost,
      play: [flynnRiderConfidentVagabond],
    });
    const returnId = testEngine.findCardInstanceId(flynnRiderConfidentVagabond, "play", "p1");
    const invalidPlayId = testEngine.findCardInstanceId(cheshireCatAlwaysGrinning, "hand", "p1");

    expect(
      testEngine.asPlayerOne().playCard(bibbidiBobbidiBoo, {
        targets: [returnId, invalidPlayId],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getCardZone(returnId)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(invalidPlayId)).toBe("hand");
  });

  it("returns the chosen character but does NOT auto-play when no explicit play target is supplied", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [bibbidiBobbidiBoo, cheshireCatAlwaysGrinning],
      inkwell: bibbidiBobbidiBoo.cost,
      play: [tamatoaDrabLittleCrab],
    });
    const returnId = testEngine.findCardInstanceId(tamatoaDrabLittleCrab, "play", "p1");
    const playId = testEngine.findCardInstanceId(cheshireCatAlwaysGrinning, "hand", "p1");

    expect(
      testEngine.asPlayerOne().playCard(bibbidiBobbidiBoo, {
        targets: [returnId],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getCardZone(returnId)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(playId)).toBe("hand");
  });

  it("does offer the returned character as the follow-up character to play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [bibbidiBobbidiBoo, cheshireCatAlwaysGrinning],
      inkwell: bibbidiBobbidiBoo.cost,
      play: [tamatoaDrabLittleCrab],
    });
    const returnId = testEngine.findCardInstanceId(tamatoaDrabLittleCrab, "play", "p1");
    const playId = testEngine.findCardInstanceId(cheshireCatAlwaysGrinning, "hand", "p1");

    expect(
      testEngine.asPlayerOne().playCard(bibbidiBobbidiBoo, {
        targets: [returnId],
      }),
    ).toBeSuccessfulCommand();

    const [pendingEffect] = testEngine.asPlayerOne().getPendingEffects();
    expect(pendingEffect?.selectionContext?.kind).toBe("target-selection");
    if (pendingEffect?.selectionContext?.kind === "target-selection") {
      expect(pendingEffect.selectionContext.cardCandidateIds).toContain(playId);
      expect(pendingEffect.selectionContext.cardCandidateIds).toContain(returnId);
    }
  });
});
