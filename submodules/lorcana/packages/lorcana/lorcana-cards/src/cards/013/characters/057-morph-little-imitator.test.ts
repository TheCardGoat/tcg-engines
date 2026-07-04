import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { cogsworthGrandfatherClock } from "../../002/characters/142-cogsworth-grandfather-clock";
import { flotsamJetsamEntanglingEels } from "../../004/characters/044-flotsam-jetsam-entangling-eels";
import { baymaxGiantRobot } from "../../007/characters/104-baymax-giant-robot";
import { theMadrigalFamilyEveryGeneration } from "./030-the-madrigal-family-every-generation";
import { morphLittleImitator } from "./057-morph-little-imitator";
import { sulleyBooScareBuddies } from "./029-sulley-boo-scare-buddies";
import { mickeyMouseMinnieMouseAdventuringDuo } from "./099-mickey-mouse-minnie-mouse-adventuring-duo";
import { sunYeeRedPandaSpirit } from "./119-sun-yee-red-panda-spirit";

const discardFodderOne = createMockCharacter({
  id: "morph-little-imitator-discard-fodder-one",
  name: "Discard Fodder One",
  cost: 1,
});

const discardFodderTwo = createMockCharacter({
  id: "morph-little-imitator-discard-fodder-two",
  name: "Discard Fodder Two",
  cost: 1,
});

const booShiftBase = createMockCharacter({
  id: "morph-little-imitator-boo-shift-base",
  name: "Boo",
  cost: 2,
});

const minnieShiftBase = createMockCharacter({
  id: "morph-little-imitator-minnie-shift-base",
  name: "Minnie Mouse",
  cost: 2,
});

describe("Morph - Little Imitator", () => {
  it("can be used as the target for name-based Shift", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [cogsworthGrandfatherClock],
      play: [morphLittleImitator],
      inkwell: 3,
    });

    const shiftTarget = testEngine.findCardInstanceId(morphLittleImitator, "play", PLAYER_ONE);

    expect(
      testEngine.asPlayerOne().playCard(cogsworthGrandfatherClock, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(cogsworthGrandfatherClock)).toBe("play");
    expect(testEngine.getCardsUnder(cogsworthGrandfatherClock)).toEqual([shiftTarget]);
  });

  it("can be used as the target for classification-based Shift", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [theMadrigalFamilyEveryGeneration],
      play: [morphLittleImitator],
      inkwell: 3,
    });

    const shiftTarget = testEngine.findCardInstanceId(morphLittleImitator, "play", PLAYER_ONE);

    expect(
      testEngine.asPlayerOne().playCard(theMadrigalFamilyEveryGeneration, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(theMadrigalFamilyEveryGeneration)).toBe("play");
    expect(testEngine.getCardsUnder(theMadrigalFamilyEveryGeneration)).toEqual([shiftTarget]);
  });

  it("can be used as the target for Universal Shift", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [baymaxGiantRobot],
      play: [{ card: morphLittleImitator, damage: 1 }],
      inkwell: 4,
    });

    const shiftTarget = testEngine.findCardInstanceId(morphLittleImitator, "play", PLAYER_ONE);

    expect(
      testEngine.asPlayerOne().playCard(baymaxGiantRobot, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(baymaxGiantRobot)).toBe("play");
    expect(testEngine.getCardsUnder(baymaxGiantRobot)).toEqual([shiftTarget]);
  });

  it("can be used as the target for discard-cost Shift", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [discardFodderOne, discardFodderTwo, flotsamJetsamEntanglingEels],
      play: [morphLittleImitator],
      inkwell: 0,
    });

    const shiftTarget = testEngine.findCardInstanceId(morphLittleImitator, "play", PLAYER_ONE);
    const discardOne = testEngine.findCardInstanceId(discardFodderOne, "hand", PLAYER_ONE);
    const discardTwo = testEngine.findCardInstanceId(discardFodderTwo, "hand", PLAYER_ONE);

    expect(
      testEngine.asPlayerOne().playCard(flotsamJetsamEntanglingEels, {
        cost: {
          cost: "shift",
          shiftTarget,
          discardCards: [discardOne, discardTwo],
        },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(flotsamJetsamEntanglingEels)).toBe("play");
    expect(testEngine.getCardsUnder(flotsamJetsamEntanglingEels)).toEqual([shiftTarget]);
    expect(testEngine.asPlayerOne().getCardZone(discardFodderOne)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(discardFodderTwo)).toBe("discard");
  });

  it("can be used as the target for Temporary Shift", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [sunYeeRedPandaSpirit],
      play: [{ card: morphLittleImitator, damage: 1 }],
      inkwell: 2,
    });

    const shiftTarget = testEngine.findCardInstanceId(morphLittleImitator, "play", PLAYER_ONE);

    expect(
      testEngine.asPlayerOne().playCard(sunYeeRedPandaSpirit, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(sunYeeRedPandaSpirit)).toBe("play");
    expect(testEngine.getCardsUnder(sunYeeRedPandaSpirit)).toEqual([shiftTarget]);
  });

  it("can be used as the target for Combo Shift", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [sulleyBooScareBuddies],
      play: [morphLittleImitator, booShiftBase],
      inkwell: 4,
    });

    const morphTarget = testEngine.findCardInstanceId(morphLittleImitator, "play", PLAYER_ONE);
    const booTarget = testEngine.findCardInstanceId(booShiftBase, "play", PLAYER_ONE);

    expect(
      testEngine.asPlayerOne().playCard(sulleyBooScareBuddies, {
        cost: {
          cost: "shift",
          shiftTarget: morphTarget,
          additionalShiftTargets: [booTarget],
        },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(sulleyBooScareBuddies)).toBe("play");
    expect(testEngine.getCardsUnder(sulleyBooScareBuddies)).toEqual([morphTarget, booTarget]);
  });

  it("can be used as the target for Duo Shift", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [mickeyMouseMinnieMouseAdventuringDuo],
      play: [morphLittleImitator, minnieShiftBase],
      inkwell: 0,
    });

    const morphTarget = testEngine.findCardInstanceId(morphLittleImitator, "play", PLAYER_ONE);
    const minnieTarget = testEngine.findCardInstanceId(minnieShiftBase, "play", PLAYER_ONE);

    expect(
      testEngine.asPlayerOne().playCard(mickeyMouseMinnieMouseAdventuringDuo, {
        cost: {
          cost: "shift",
          shiftTarget: morphTarget,
          additionalShiftTargets: [minnieTarget],
        },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(mickeyMouseMinnieMouseAdventuringDuo)).toBe("play");
    expect(testEngine.getCardsUnder(mickeyMouseMinnieMouseAdventuringDuo)).toEqual([
      morphTarget,
      minnieTarget,
    ]);
  });
});
