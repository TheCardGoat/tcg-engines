import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { hamishHubertHarrisTroublemakingTriplets } from "./070-hamish-hubert-harris-troublemaking-triplets";

const nonEvasiveAttacker = createMockCharacter({
  id: "hamish-non-evasive-attacker",
  name: "Non-Evasive Attacker",
  cost: 2,
  strength: 3,
  willpower: 3,
});

const evasiveAttacker = createMockCharacter({
  id: "hamish-evasive-attacker",
  name: "Evasive Attacker",
  cost: 2,
  strength: 3,
  willpower: 3,
  abilities: [{ type: "keyword", keyword: "Evasive", text: "Evasive" }],
});

describe("Hamish, Hubert & Harris - Troublemaking Triplets", () => {
  it("cannot be challenged by a character without Evasive", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: nonEvasiveAttacker, isDrying: false }],
        deck: 5,
      },
      {
        play: [{ card: hamishHubertHarrisTroublemakingTriplets, exerted: true, isDrying: false }],
        deck: 5,
      },
    );

    expect(
      testEngine
        .asPlayerOne()
        .challenge(nonEvasiveAttacker, hamishHubertHarrisTroublemakingTriplets),
    ).not.toBeSuccessfulCommand();
  });

  it("can be challenged by a character with Evasive", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: evasiveAttacker, isDrying: false }],
        deck: 5,
      },
      {
        play: [{ card: hamishHubertHarrisTroublemakingTriplets, exerted: true, isDrying: false }],
        deck: 5,
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(evasiveAttacker, hamishHubertHarrisTroublemakingTriplets),
    ).toBeSuccessfulCommand();
  });

  it("quests for 1 lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: hamishHubertHarrisTroublemakingTriplets, isDrying: false }],
      deck: 5,
    });

    expect(
      testEngine.asPlayerOne().quest(hamishHubertHarrisTroublemakingTriplets),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getLore("player_one")).toBe(1);
  });
});
