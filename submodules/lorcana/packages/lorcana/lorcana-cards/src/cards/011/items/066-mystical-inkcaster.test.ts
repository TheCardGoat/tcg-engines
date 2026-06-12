import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { mysticalInkcaster } from "./066-mystical-inkcaster";

const summonedChampion = createMockCharacter({
  id: "mystical-inkcaster-summoned-champion",
  name: "Summoned Champion",
  cost: 5,
});

const oversizedChampion = createMockCharacter({
  id: "mystical-inkcaster-oversized-champion",
  name: "Oversized Champion",
  cost: 6,
});

describe("Mystical Inkcaster", () => {
  it("plays a cost 5 or less character for free, gives them Rush, and banishes them at end of turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [summonedChampion],
        inkwell: 3,
        play: [mysticalInkcaster],
        deck: 2,
      },
      {
        deck: 2,
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(mysticalInkcaster, {
        targets: [testEngine.findCardInstanceId(summonedChampion, "hand", "p1")],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(summonedChampion)).toBe("play");
    expect(testEngine.hasKeyword(summonedChampion, "Rush")).toBe(true);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(summonedChampion)).toBe("discard");
  });

  it("does not banish the item itself at end of turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [summonedChampion],
        inkwell: 3,
        play: [mysticalInkcaster],
        deck: 2,
      },
      {
        deck: 2,
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(mysticalInkcaster, {
        targets: [testEngine.findCardInstanceId(summonedChampion, "hand", "p1")],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    // The summoned character should be banished, but the item should remain
    expect(testEngine.asPlayerOne().getCardZone(summonedChampion)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(mysticalInkcaster)).toBe("play");
  });

  it("does not let you choose a character with cost 6 or more", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [oversizedChampion],
      inkwell: 3,
      play: [mysticalInkcaster],
    });

    const result = testEngine.asPlayerOne().activateAbility(mysticalInkcaster, {
      targets: [testEngine.findCardInstanceId(oversizedChampion, "hand", "p1")],
    });

    expect(result.success).toBe(false);
    expect(testEngine.asPlayerOne().getCardZone(oversizedChampion)).toBe("hand");
  });
});
