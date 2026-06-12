import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { tritonChampionOfAtlantica } from "./158-triton-champion-of-atlantica";

describe("Triton - Champion of Atlantica", () => {
  it("should have Shift 6 keyword", () => {
    const shiftAbility = tritonChampionOfAtlantica.abilities?.find(
      (a) => a.type === "keyword" && (a as { keyword?: string }).keyword === "Shift",
    );
    expect(shiftAbility).toBeDefined();
    expect((shiftAbility as { cost?: { ink?: number } } | undefined)?.cost?.ink).toBe(6);
  });

  it("should give opposing characters -1 strength for each location the controller has in play", () => {
    const opponentCharacter = createMockCharacter({
      id: "opponent-char-001",
      name: "Opponent Character",
      cost: 3,
      strength: 5,
      willpower: 4,
      lore: 1,
    });

    const myLocation = createMockLocation({
      id: "my-location-001",
      name: "Atlantica",
      cost: 2,
      willpower: 4,
      lore: 1,
    });

    // Player one has Triton + 1 location; player two has a character
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [tritonChampionOfAtlantica, myLocation], deck: 5 },
      { play: [opponentCharacter], deck: 5 },
    );

    // Triton is in play with 1 location in play → opposing character should have -1 strength
    const baseStrength = opponentCharacter.strength ?? 0;
    expect(testEngine.asPlayerTwo().getCardStrength(opponentCharacter)).toBe(baseStrength - 1);
  });

  it("should give opposing characters -2 strength when two locations are in play", () => {
    const opponentCharacter = createMockCharacter({
      id: "opponent-char-002",
      name: "Opponent Character",
      cost: 3,
      strength: 5,
      willpower: 4,
      lore: 1,
    });

    const myLocation1 = createMockLocation({
      id: "my-location-002a",
      name: "Atlantica West",
      cost: 2,
      willpower: 4,
      lore: 1,
    });

    const myLocation2 = createMockLocation({
      id: "my-location-002b",
      name: "Atlantica East",
      cost: 2,
      willpower: 4,
      lore: 1,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [tritonChampionOfAtlantica, myLocation1, myLocation2], deck: 5 },
      { play: [opponentCharacter], deck: 5 },
    );

    const baseStrength = opponentCharacter.strength ?? 0;
    expect(testEngine.asPlayerTwo().getCardStrength(opponentCharacter)).toBe(baseStrength - 2);
  });

  it("should not affect opposing characters when controller has no locations in play", () => {
    const opponentCharacter = createMockCharacter({
      id: "opponent-char-003",
      name: "Opponent Character",
      cost: 3,
      strength: 5,
      willpower: 4,
      lore: 1,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [tritonChampionOfAtlantica], deck: 5 },
      { play: [opponentCharacter], deck: 5 },
    );

    const baseStrength = opponentCharacter.strength ?? 0;
    expect(testEngine.asPlayerTwo().getCardStrength(opponentCharacter)).toBe(baseStrength);
  });

  it("should not reduce own characters' strength", () => {
    const myCharacter = createMockCharacter({
      id: "my-char-001",
      name: "My Character",
      cost: 3,
      strength: 4,
      willpower: 3,
      lore: 1,
    });

    const myLocation = createMockLocation({
      id: "my-location-003",
      name: "Atlantica",
      cost: 2,
      willpower: 4,
      lore: 1,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [tritonChampionOfAtlantica, myCharacter, myLocation],
      deck: 5,
    });

    // Own characters should not be affected
    const baseStrength = myCharacter.strength ?? 0;
    expect(testEngine.asPlayerOne().getCardStrength(myCharacter)).toBe(baseStrength);
  });

  it("should scale strength reduction proportionally with location count", () => {
    const opponentCharacter = createMockCharacter({
      id: "opponent-char-004",
      name: "Opponent",
      cost: 3,
      strength: 6,
      willpower: 4,
      lore: 1,
    });

    const myLocation1 = createMockLocation({
      id: "my-location-004a",
      name: "Atlantica",
      cost: 2,
      willpower: 4,
      lore: 1,
    });

    const myLocation2 = createMockLocation({
      id: "my-location-004b",
      name: "Atlantica 2",
      cost: 2,
      willpower: 4,
      lore: 1,
    });

    const myLocation3 = createMockLocation({
      id: "my-location-004c",
      name: "Atlantica 3",
      cost: 2,
      willpower: 4,
      lore: 1,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [tritonChampionOfAtlantica, myLocation1, myLocation2, myLocation3], deck: 5 },
      { play: [opponentCharacter], deck: 5 },
    );

    const baseStrength = opponentCharacter.strength ?? 0;
    // 3 locations → -3 strength
    expect(testEngine.asPlayerTwo().getCardStrength(opponentCharacter)).toBe(baseStrength - 3);
  });
});
