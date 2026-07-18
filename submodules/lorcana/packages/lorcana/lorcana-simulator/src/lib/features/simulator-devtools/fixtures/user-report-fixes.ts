import {
  mickeyMouseTrueFriend,
  minnieMouseBelovedPrincess,
  moanaChosenByTheOcean,
  reflection,
  simbaProtectiveCub,
} from "@tcg/lorcana-cards/cards/001";
import { dinnerBell } from "@tcg/lorcana-cards/cards/002";
import { circleOfLife, underTheSea } from "@tcg/lorcana-cards/cards/009";
import {
  darkwingDuckLaunchpadStCanardsFinest,
  darkwingDuckShadowySuperhero,
  launchpadSkyPatrol,
  meilinLeeLeadVocalist,
  mickeyMouseMinnieMouseAdventuringDuo,
  morphLittleImitator,
} from "@tcg/lorcana-cards/cards/013";
import { createFixture } from "./fixture-factory.js";

export const USER_REPORT_FIXTURE_IDS = [
  "user-reports-meilin-sing-together",
  "user-reports-darkwing-launchpad-shift",
  "user-reports-mickey-minnie-duo-shift",
] as const;

export const userReportsMeilinSingTogetherFixture = createFixture({
  id: "user-reports-meilin-sing-together",
  name: "User Report QA - Meilin Sing Together",
  description:
    "Reload between songs. Choose Under the Sea or Circle of Life, choose Sing Together, and verify Meilin - Lead Vocalist is offered alongside Moana. Meilin must not be offered for an ordinary song.",
  skipPreGame: true,
  playerOne: {
    hand: [underTheSea, circleOfLife],
    play: [
      { card: meilinLeeLeadVocalist, isDrying: false },
      { card: moanaChosenByTheOcean, isDrying: false },
    ],
    discard: [mickeyMouseTrueFriend],
    deck: [reflection, simbaProtectiveCub],
    inkwell: 0,
  },
  playerTwo: {
    hand: [],
    play: [{ card: simbaProtectiveCub, exerted: true, isDrying: false }],
    deck: [reflection],
    inkwell: 0,
  },
});

export const userReportsDarkwingLaunchpadShiftFixture = createFixture({
  id: "user-reports-darkwing-launchpad-shift",
  name: "User Report QA - Darkwing and Launchpad Shift",
  description:
    "Reload between targets. Shift Darkwing Duck & Launchpad - St. Canard's Finest onto Darkwing Duck, Launchpad, and Morph. Each of the three characters must be offered as a legal Shift target.",
  skipPreGame: true,
  playerOne: {
    hand: [darkwingDuckLaunchpadStCanardsFinest],
    play: [
      { card: darkwingDuckShadowySuperhero, isDrying: false },
      { card: launchpadSkyPatrol, isDrying: false },
      { card: morphLittleImitator, isDrying: false },
    ],
    deck: [reflection],
    inkwell: 5,
  },
  playerTwo: {
    hand: [],
    play: [],
    deck: [reflection],
    inkwell: 0,
  },
});

export const userReportsMickeyMinnieDuoShiftFixture = createFixture({
  id: "user-reports-mickey-minnie-duo-shift",
  name: "User Report QA - Mickey and Minnie Duo Shift",
  description:
    "Duo Shift Mickey & Minnie onto Mickey (1 damage, ready, dry) and Minnie (2 damage, ready, drying). The result must have 3 damage and be drying, so it cannot quest this turn. Then activate Dinner Bell, choose the shifted character, and verify all three cards enter the inkwell facedown and exerted.",
  skipPreGame: true,
  playerOne: {
    hand: [mickeyMouseMinnieMouseAdventuringDuo],
    play: [
      { card: mickeyMouseTrueFriend, damage: 1, isDrying: false },
      { card: minnieMouseBelovedPrincess, damage: 2, isDrying: true },
      dinnerBell,
    ],
    deck: [reflection, simbaProtectiveCub, moanaChosenByTheOcean, reflection],
    inkwell: 2,
  },
  playerTwo: {
    hand: [],
    play: [],
    deck: [reflection],
    inkwell: 0,
  },
});
