import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { instituteOfTechnologyPrestigiousUniversity } from "./170-institute-of-technology-prestigious-university";

const inventorResident = createMockCharacter({
  id: "institute-inventor",
  name: "Inventor Resident",
  cost: 2,
  classifications: ["Storyborn", "Inventor"],
  willpower: 3,
});

const nonInventorResident = createMockCharacter({
  id: "institute-non-inventor",
  name: "Non Inventor",
  cost: 2,
  willpower: 3,
});

describe("Institute of Technology - Prestigious University", () => {
  it("gives Inventor characters here +1 willpower", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        instituteOfTechnologyPrestigiousUniversity,
        { card: inventorResident, atLocation: instituteOfTechnologyPrestigiousUniversity },
        { card: nonInventorResident, atLocation: instituteOfTechnologyPrestigiousUniversity },
      ],
    });

    expect(testEngine.asPlayerOne().getCard(inventorResident)?.willpower).toBe(
      inventorResident.willpower + 1,
    );
    expect(testEngine.asPlayerOne().getCard(nonInventorResident)?.willpower).toBe(
      nonInventorResident.willpower,
    );
  });

  it("gains 1 lore at the start of your turn if you have a character here", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          instituteOfTechnologyPrestigiousUniversity,
          { card: inventorResident, atLocation: instituteOfTechnologyPrestigiousUniversity },
        ],
        deck: 1,
      },
      {
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(instituteOfTechnologyPrestigiousUniversity)
        .success,
    ).toBe(true);
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(1);
  });
});
