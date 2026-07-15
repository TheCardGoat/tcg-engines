import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { calhounCourageousRescuer } from "./026-calhoun-courageous-rescuer";

const defender = createMockCharacter({
  id: "calhoun-defender",
  name: "Opposing Defender",
  cost: 3,
  strength: 2,
  willpower: 3,
});

const racerInDiscard = createMockCharacter({
  id: "calhoun-racer-in-discard",
  name: "Racer In Discard",
  cost: 2,
  classifications: ["Dreamborn", "Hero", "Racer"],
});

const nonRacerInDiscard = createMockCharacter({
  id: "calhoun-non-racer-in-discard",
  name: "Non Racer In Discard",
  cost: 2,
  classifications: ["Storyborn", "Hero"],
});

describe("Calhoun - Courageous Rescuer", () => {
  it("BACK TO START POSITIONS! - may return a Racer character card from discard to hand when challenging", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [calhounCourageousRescuer],
        discard: [{ card: racerInDiscard }],
        deck: 1,
      },
      {
        play: [{ card: defender, exerted: true }],
        deck: 1,
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(calhounCourageousRescuer, defender),
    ).toBeSuccessfulCommand();

    // Triggered ability should create a bag entry
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(calhounCourageousRescuer, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();

    // Choose the Racer card from discard if a pending choice exists
    const pendingChoice = testEngine.asPlayerOne().getPendingChoice();
    if (pendingChoice) {
      const racerDiscardId = testEngine.findCardInstanceId(racerInDiscard, "discard");
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [racerDiscardId] }),
      ).toBeSuccessfulCommand();
    }

    expect(testEngine.asPlayerOne().getCardZone(racerInDiscard)).toBe("hand");
  });

  it("BACK TO START POSITIONS! - can decline the optional ability", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [calhounCourageousRescuer],
        discard: [{ card: racerInDiscard }],
        deck: 1,
      },
      {
        play: [{ card: defender, exerted: true }],
        deck: 1,
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(calhounCourageousRescuer, defender),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(calhounCourageousRescuer, {
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();

    // Racer should remain in discard
    expect(testEngine.asPlayerOne().getCardZone(racerInDiscard)).toBe("discard");
  });

  it("BACK TO START POSITIONS! - does not trigger when not challenging", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [calhounCourageousRescuer],
      discard: [{ card: racerInDiscard }],
      deck: 1,
    });

    // Quest instead of challenging
    expect(testEngine.asPlayerOne().quest(calhounCourageousRescuer)).toBeSuccessfulCommand();

    // No bag entry should be created
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });
});
