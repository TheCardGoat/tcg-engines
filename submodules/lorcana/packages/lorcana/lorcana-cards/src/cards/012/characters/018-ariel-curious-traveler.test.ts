import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { arielCuriousTraveler } from "./018-ariel-curious-traveler";

const anotherCharacter = createMockCharacter({
  id: "ariel-ally",
  name: "Ally",
  cost: 1,
  strength: 1,
  willpower: 1,
});

const opposingCharacter = createMockCharacter({
  id: "ariel-opponent",
  name: "Opponent Character",
  cost: 3,
  strength: 2,
  willpower: 4,
});

describe("Ariel - Curious Traveler", () => {
  it("FAMILIAR GROUND - restricts opposing character from challenging and forces quest when questing after playing another character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [anotherCharacter],
        play: [arielCuriousTraveler],
        inkwell: 1,
        deck: 5,
      },
      {
        play: [opposingCharacter],
        deck: 5,
      },
    );

    expect(testEngine.asPlayerOne().playCard(anotherCharacter)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().quest(arielCuriousTraveler)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(arielCuriousTraveler, {
        targets: [opposingCharacter],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.hasRestriction(opposingCharacter, "cant-challenge")).toBe(true);
    expect(testEngine.hasRestriction(opposingCharacter, "must-quest")).toBe(true);
  });
});
