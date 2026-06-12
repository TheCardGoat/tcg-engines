import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { beastsCastleWinterGardens } from "./136-beasts-castle-winter-gardens";

const castleResident = createMockCharacter({
  id: "winter-garden-resident",
  name: "Winter Garden Resident",
  cost: 2,
  strength: 3,
  willpower: 3,
});

const secondResident = createMockCharacter({
  id: "winter-garden-second-resident",
  name: "Winter Garden Second Resident",
  cost: 2,
  strength: 3,
  willpower: 3,
});

const challengeTarget = createMockCharacter({
  id: "winter-garden-target",
  name: "Winter Garden Target",
  cost: 2,
  strength: 1,
  willpower: 2,
});

const secondChallengeTarget = createMockCharacter({
  id: "winter-garden-second-target",
  name: "Winter Garden Second Target",
  cost: 2,
  strength: 1,
  willpower: 2,
});

const opponentLocation = createMockLocation({
  id: "winter-garden-opponent-location",
  name: "Opponent Location",
  cost: 2,
  moveCost: 1,
  willpower: 8,
});

describe("Beast's Castle - Winter Gardens", () => {
  it("gains 1 lore when a character here challenges another character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          { card: castleResident, atLocation: beastsCastleWinterGardens },
          beastsCastleWinterGardens,
        ],
      },
      {
        play: [{ card: challengeTarget, exerted: true }],
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(castleResident, challengeTarget),
    ).toBeSuccessfulCommand();
    expect(testEngine.getLore(PLAYER_ONE)).toBe(1);
  });

  it("does not gain lore when a character not at the location challenges", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [beastsCastleWinterGardens, castleResident],
      },
      {
        play: [{ card: challengeTarget, exerted: true }],
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(castleResident, challengeTarget),
    ).toBeSuccessfulCommand();
    expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
  });

  it("gains 1 lore for each challenge when multiple characters at the location challenge", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          beastsCastleWinterGardens,
          { card: castleResident, atLocation: beastsCastleWinterGardens },
          { card: secondResident, atLocation: beastsCastleWinterGardens },
        ],
      },
      {
        play: [
          { card: challengeTarget, exerted: true },
          { card: secondChallengeTarget, exerted: true },
        ],
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(castleResident, challengeTarget),
    ).toBeSuccessfulCommand();
    expect(testEngine.getLore(PLAYER_ONE)).toBe(1);
    expect(
      testEngine.asPlayerOne().challenge(secondResident, secondChallengeTarget),
    ).toBeSuccessfulCommand();
    expect(testEngine.getLore(PLAYER_ONE)).toBe(2);
  });

  it("does not gain lore when a character here challenges a location", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          beastsCastleWinterGardens,
          { card: castleResident, atLocation: beastsCastleWinterGardens },
        ],
      },
      {
        play: [opponentLocation],
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(castleResident, opponentLocation),
    ).toBeSuccessfulCommand();
    expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
  });
});
