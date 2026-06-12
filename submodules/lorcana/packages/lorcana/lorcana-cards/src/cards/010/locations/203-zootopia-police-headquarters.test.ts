import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { zootopiaPoliceHeadquarters } from "./203-zootopia-police-headquarters";

const zootopiaDetective = createMockCharacter({
  id: "zootopia-detective",
  name: "Zootopia Detective",
  cost: 2,
});

const zootopiaOfficer = createMockCharacter({
  id: "zootopia-officer",
  name: "Zootopia Officer",
  cost: 2,
});

const zootopiaClue = createMockCharacter({
  id: "zootopia-clue",
  name: "Zootopia Clue",
  cost: 3,
});

describe("Zootopia - Police Headquarters", () => {
  it("lets you draw a card, then choose and discard a card, when you move a character here", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [zootopiaPoliceHeadquarters, zootopiaDetective],
      hand: [zootopiaClue],
      inkwell: zootopiaPoliceHeadquarters.moveCost,
      deck: 2,
    });

    expect(
      testEngine
        .asPlayerOne()
        .moveCharacterToLocation(zootopiaDetective, zootopiaPoliceHeadquarters).success,
    ).toBe(true);
    expect(testEngine.asPlayerOne().resolvePendingByCard(zootopiaPoliceHeadquarters).success).toBe(
      true,
    );
    expect(testEngine.asPlayerOne().resolveNextPending({ targets: [zootopiaClue] }).success).toBe(
      true,
    );
    expect(testEngine.asPlayerOne().getCardZone(zootopiaClue)).toBe("discard");
  });

  it("does not trigger a second time when a second character is moved here during the same turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [zootopiaPoliceHeadquarters, zootopiaDetective, zootopiaOfficer],
      hand: [zootopiaClue],
      inkwell: zootopiaPoliceHeadquarters.moveCost * 2,
      deck: 2,
    });

    // First move triggers the ability
    expect(
      testEngine
        .asPlayerOne()
        .moveCharacterToLocation(zootopiaDetective, zootopiaPoliceHeadquarters).success,
    ).toBe(true);
    expect(testEngine.asPlayerOne().resolvePendingByCard(zootopiaPoliceHeadquarters).success).toBe(
      true,
    );
    expect(testEngine.asPlayerOne().resolveNextPending({ targets: [zootopiaClue] }).success).toBe(
      true,
    );

    // Second move should NOT trigger the ability again
    expect(
      testEngine.asPlayerOne().moveCharacterToLocation(zootopiaOfficer, zootopiaPoliceHeadquarters)
        .success,
    ).toBe(true);
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });
});
