import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { theIslandOfNomanisanSyndromesHeadquarters } from "./204-the-island-of-nomanisan-syndromes-headquarters";

const robotResident = createMockCharacter({
  id: "nomanisan-robot",
  name: "Omnidroid Prototype",
  classifications: ["Storyborn", "Robot"],
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
});

const nonRobotResident = createMockCharacter({
  id: "nomanisan-non-robot",
  name: "Island Guard",
  classifications: ["Storyborn", "Hero"],
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
});

describe("The Island of Nomanisan - Syndrome's Headquarters", () => {
  it("RESEARCH & DEVELOPMENT - Robot characters here get +1 {S} and +1 {W}", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        theIslandOfNomanisanSyndromesHeadquarters,
        {
          card: robotResident,
          atLocation: theIslandOfNomanisanSyndromesHeadquarters,
        },
        {
          card: nonRobotResident,
          atLocation: theIslandOfNomanisanSyndromesHeadquarters,
        },
      ],
    });

    expect(testEngine.getCard(robotResident).strength).toBe(robotResident.strength + 1);
    expect(testEngine.getCard(robotResident).willpower).toBe(robotResident.willpower + 1);

    // Non-robot characters at the location do not gain the bonus.
    expect(testEngine.getCard(nonRobotResident).strength).toBe(nonRobotResident.strength);
    expect(testEngine.getCard(nonRobotResident).willpower).toBe(nonRobotResident.willpower);
  });

  it("RESEARCH & DEVELOPMENT - Robot characters not at this location do not get the bonus", () => {
    const robotElsewhere = createMockCharacter({
      id: "nomanisan-robot-elsewhere",
      name: "Stray Bot",
      classifications: ["Storyborn", "Robot"],
      cost: 2,
      strength: 2,
      willpower: 2,
      lore: 1,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [theIslandOfNomanisanSyndromesHeadquarters, robotElsewhere],
    });

    expect(testEngine.getCard(robotElsewhere).strength).toBe(robotElsewhere.strength);
    expect(testEngine.getCard(robotElsewhere).willpower).toBe(robotElsewhere.willpower);
  });

  it("CHEAP SHOT - deals 2 damage to chosen character when a character here banishes another in a challenge", () => {
    const attacker = createMockCharacter({
      id: "nomanisan-attacker",
      name: "Nomanisan Attacker",
      cost: 3,
      strength: 4,
      willpower: 4,
    });

    const opposingTarget = createMockCharacter({
      id: "nomanisan-opposing",
      name: "Opposing Target",
      cost: 2,
      strength: 1,
      willpower: 2,
    });

    const damageVictim = createMockCharacter({
      id: "nomanisan-damage-victim",
      name: "Damage Victim",
      cost: 2,
      strength: 1,
      willpower: 5,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          theIslandOfNomanisanSyndromesHeadquarters,
          {
            card: attacker,
            atLocation: theIslandOfNomanisanSyndromesHeadquarters,
            isDrying: false,
          },
        ],
      },
      {
        play: [
          { card: opposingTarget, exerted: true, isDrying: false },
          { card: damageVictim, isDrying: false },
        ],
      },
    );

    expect(testEngine.asPlayerOne().challenge(attacker, opposingTarget)).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(theIslandOfNomanisanSyndromesHeadquarters, {
        resolveOptional: true,
        targets: [damageVictim],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.getCard(damageVictim)?.damage).toBe(2);
  });
});
