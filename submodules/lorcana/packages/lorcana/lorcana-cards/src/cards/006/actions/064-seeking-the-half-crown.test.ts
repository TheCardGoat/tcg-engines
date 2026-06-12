import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  PLAYER_ONE,
} from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { seekingTheHalfCrown } from "./064-seeking-the-half-crown";

const sorcerer = createMockCharacter({
  id: "mock-sorcerer",
  name: "Mock Sorcerer",
  cost: 1,
  classifications: ["Storyborn", "Sorcerer"],
});

const nonSorcerer = createMockCharacter({
  id: "mock-hero",
  name: "Mock Hero",
  cost: 1,
  classifications: ["Storyborn", "Hero"],
});

describe("Seeking the Half Crown", () => {
  it("draws 2 cards when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [seekingTheHalfCrown],
      inkwell: seekingTheHalfCrown.cost,
      deck: [simbaProtectiveCub, simbaProtectiveCub],
    });

    const initialHandCount = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;

    expect(
      testEngine.asPlayerOne().playCard(seekingTheHalfCrown, { targets: [] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count).toBe(
      initialHandCount + 1,
    );
  });

  it("cannot be played without enough ink", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [seekingTheHalfCrown],
      inkwell: seekingTheHalfCrown.cost - 1,
      deck: [simbaProtectiveCub, simbaProtectiveCub],
    });

    expect(testEngine.asPlayerOne().playCard(seekingTheHalfCrown, { targets: [] }).success).toBe(
      false,
    );
  });

  it("costs 1 ink less for each Sorcerer character you have in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [seekingTheHalfCrown],
      inkwell: 2,
      deck: [simbaProtectiveCub, simbaProtectiveCub],
      play: [sorcerer, sorcerer, sorcerer],
    });

    expect(
      testEngine.asPlayerOne().playCard(seekingTheHalfCrown, { targets: [] }),
    ).toBeSuccessfulCommand();
  });

  it("does not reduce cost for non-Sorcerer characters in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [seekingTheHalfCrown],
      inkwell: seekingTheHalfCrown.cost - 1,
      deck: [simbaProtectiveCub, simbaProtectiveCub],
      play: [nonSorcerer, nonSorcerer, nonSorcerer],
    });

    expect(testEngine.asPlayerOne().playCard(seekingTheHalfCrown, { targets: [] }).success).toBe(
      false,
    );
  });

  it("does not reduce cost for opponent's Sorcerer characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [seekingTheHalfCrown],
        inkwell: seekingTheHalfCrown.cost - 1,
        deck: [simbaProtectiveCub, simbaProtectiveCub],
      },
      {
        play: [sorcerer, sorcerer, sorcerer],
        deck: [simbaProtectiveCub, simbaProtectiveCub],
      },
    );

    expect(testEngine.asPlayerOne().playCard(seekingTheHalfCrown, { targets: [] }).success).toBe(
      false,
    );
  });

  it("cost reduction and draw both work together", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [seekingTheHalfCrown],
      inkwell: 3,
      deck: [simbaProtectiveCub, simbaProtectiveCub],
      play: [sorcerer, sorcerer],
    });

    const initialHandCount = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;

    expect(
      testEngine.asPlayerOne().playCard(seekingTheHalfCrown, { targets: [] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count).toBe(
      initialHandCount + 1,
    );
  });
});
