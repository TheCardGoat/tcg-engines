import { createFixture } from "./fixture-factory";
import {
  _99Puppies,
  divebomb,
  howFarIllGo,
  lastditchEffort,
  theBossIsOnARoll,
} from "@tcg/lorcana-cards/cards/003";
import { loseTheWay } from "@tcg/lorcana-cards/cards/006";
import {
  dragonFire,
  friendsOnTheOtherSide,
  hakunaMatata,
  mauiHeroToAll,
  mickeyMouseTrueFriend,
  minnieMouseAlwaysClassy,
  reflection,
  theQueenWickedAndVain,
} from "@tcg/lorcana-cards/cards/001";
import { madamMimRivalOfMerlin, theQueenCommandingPresence } from "@tcg/lorcana-cards/cards/002";
import {
  bambiEtherealFawn,
  darkwingDuckCoolUnderPressure,
  donaldDuckAlongForTheRide,
  peteGhostOfChristmasFuture,
} from "@tcg/lorcana-cards/cards/011";
import {
  aurelianGyrosensor,
  julietaMadrigalExcellentCook,
  powerlineWorldsGreatestRockStar,
} from "@tcg/lorcana-cards/cards/009";
import { theFamilyMadrigal, waterHasMemory } from "@tcg/lorcana-cards/cards/007";
import {
  merlinBackFromBermuda,
  merlinIntellectualVisionary,
  moanaDeterminedExplorer,
  robinHoodSharpshooter,
} from "@tcg/lorcana-cards/cards/005";
import { daisyDuckSapphireChampion } from "@tcg/lorcana-cards/cards/010";
import { brunoMadrigalOutOfTheShadows, theQueenDiviner } from "@tcg/lorcana-cards/cards/004";
import { televisionSet, downInNewOrleans } from "@tcg/lorcana-cards/cards/008";
import { developYourBrain } from "@tcg/lorcana-cards/cards/001";

export const lookAtTheTopFixture = createFixture({
  id: "look-at-the-top",
  name: "Look at the top",
  description: "Testing various scenarios in which the player is prompted to look at the top cards",
  skipPreGame: true,
  playerOne: {
    inkwell: 20,
    hand: [
      developYourBrain,
      reflection,
      theFamilyMadrigal,
      downInNewOrleans,
      merlinIntellectualVisionary,
      waterHasMemory,
      theQueenDiviner,
      theBossIsOnARoll,
      howFarIllGo,
      friendsOnTheOtherSide,
      friendsOnTheOtherSide,
      friendsOnTheOtherSide,
    ],
    play: [
      aurelianGyrosensor,
      daisyDuckSapphireChampion,
      robinHoodSharpshooter,
      powerlineWorldsGreatestRockStar,
      merlinBackFromBermuda,
      { card: bambiEtherealFawn, cardsUnder: [loseTheWay] },
      televisionSet,
      peteGhostOfChristmasFuture,
      theQueenWickedAndVain,
      theQueenWickedAndVain,
      theQueenWickedAndVain,
    ],
    deck: [
      dragonFire,
      loseTheWay,
      reflection,
      brunoMadrigalOutOfTheShadows,
      hakunaMatata,
      moanaDeterminedExplorer,
      julietaMadrigalExcellentCook,
      _99Puppies,
    ],
  },
  playerTwo: {
    hand: [mickeyMouseTrueFriend, divebomb, lastditchEffort],
    play: [
      madamMimRivalOfMerlin,
      darkwingDuckCoolUnderPressure,
      powerlineWorldsGreatestRockStar,
      minnieMouseAlwaysClassy,
      theQueenCommandingPresence,
      mauiHeroToAll,
      { card: donaldDuckAlongForTheRide, exerted: true },
    ],
  },
});
