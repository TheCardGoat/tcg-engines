import { createFixture } from "./fixture-factory";
import type { LorcanaSimulatorFixture } from "@/features/simulator/model/contracts.js";
import {
  mickeyMouseBraveLittleTailor,
  rapunzelGiftedWithHealing,
  dinglehopper,
  shieldOfVirtue,
  goofyMusketeer,
  tinkerBellPeterPansAlly,
  mauiHeroToAll,
  bePrepared,
  aladdinStreetRat,
  princePhillipDragonslayer,
  maleficentSorceress,
  stitchRockStar,
  elsaGlovesOff,
  peterPansShadowNotSewnOn,
  mickeyMouseTrueFriend,
  arielSingingMermaid,
  developYourBrain,
  motherKnowsBest,
  smash,
  maleficentBidingHerTime,
  arielOnHumanLegs,
  arielWhoseitCollector,
  mickeyMouseWaywardSorcerer,
  stitchNewDog,
  stitchAbomination,
  elsaQueenRegent,
  mulanImperialSoldier,
  mauiDemigod,
  magicBroomBucketBrigade,
  hadesKingOfOlympus,
  befuddle,
  hakunaMatata,
  aWholeNewWorld,
  youHaveForgottenMe,
  controlYourTemper,
} from "./fixture-cards";
import * as cards001Module from "@tcg/lorcana-cards/cards/001";
import * as cards003Module from "@tcg/lorcana-cards/cards/003";
import * as cards004Module from "@tcg/lorcana-cards/cards/004";
import * as cards005Module from "@tcg/lorcana-cards/cards/005";
import * as cards007Module from "@tcg/lorcana-cards/cards/007";
import * as cards008Module from "@tcg/lorcana-cards/cards/008";
import * as cards010Module from "@tcg/lorcana-cards/cards/010";
import { pawpsicle } from "@tcg/lorcana-cards/cards/002";
import { grandmotherWillowAncientAdvisorEpic } from "@tcg/lorcana-cards/cards/011";

const { coconutBasket, friendsOnTheOtherSide } =
  cards001Module as typeof import("@tcg/lorcana-cards/cards/001");
const {
  friendLikeMe,
  kuzcosPalaceHomeOfTheEmperor,
  prideLandsPrideRock,
  tianasPalaceJazzRestaurant,
} = cards003Module as typeof import("@tcg/lorcana-cards/cards/003");
const {
  agustinMadrigalClumsyDad,
  brunoMadrigalOutOfTheShadows,
  hiddenCoveTranquilHaven,
  isabelaMadrigalGoldenChild,
} = cards004Module as typeof import("@tcg/lorcana-cards/cards/004");
const { amberChromicon, moanaDeterminedExplorer } =
  cards005Module as typeof import("@tcg/lorcana-cards/cards/005");
const { mauricesMachine } = cards007Module as typeof import("@tcg/lorcana-cards/cards/007");
const { almaMadrigalAcceptingGrandmother } =
  cards008Module as typeof import("@tcg/lorcana-cards/cards/008");
const { demonaBetrayerOfTheClan, goliathClanLeader } =
  cards010Module as typeof import("@tcg/lorcana-cards/cards/010");

export const fullBoardAllCardTypes: LorcanaSimulatorFixture = createFixture({
  id: "all-card-types-full-board",
  name: "All Card Types in one Board",
  description: "Show Case of a full board with all card types ",
  seed: "all-card-types-full-board",
  playerOne: {
    deck: [
      mickeyMouseBraveLittleTailor,
      rapunzelGiftedWithHealing,
      dinglehopper,
      shieldOfVirtue,
      goofyMusketeer,
      tinkerBellPeterPansAlly,
      mauiHeroToAll,
      bePrepared,
      aladdinStreetRat,
      princePhillipDragonslayer,
      maleficentSorceress,
    ],
    discard: [
      stitchRockStar,
      elsaGlovesOff,
      peterPansShadowNotSewnOn,
      mickeyMouseTrueFriend,
      arielSingingMermaid,
      developYourBrain,
      motherKnowsBest,
      smash,
    ],
    hand: [
      grandmotherWillowAncientAdvisorEpic,
      mickeyMouseBraveLittleTailor,
      rapunzelGiftedWithHealing,
      friendsOnTheOtherSide,
      friendLikeMe,
    ],
    inkwell: 4,
    lore: 3,
    play: [
      tianasPalaceJazzRestaurant,
      {
        card: goofyMusketeer,
        atLocation: tianasPalaceJazzRestaurant,
        exerted: true,
      },
      { card: tinkerBellPeterPansAlly, exerted: true },
      moanaDeterminedExplorer,
      // Items
      amberChromicon,
      mauricesMachine,
      pawpsicle,
      cards004Module.fortisphere,
    ],
  },
  playerTwo: {
    deck: [
      arielOnHumanLegs,
      arielWhoseitCollector,
      goofyMusketeer,
      mickeyMouseBraveLittleTailor,
      mickeyMouseWaywardSorcerer,
      rapunzelGiftedWithHealing,
      tinkerBellPeterPansAlly,
      stitchNewDog,
      stitchAbomination,
      elsaQueenRegent,
      maleficentBidingHerTime,
      maleficentSorceress,
      princePhillipDragonslayer,
      mulanImperialSoldier,
      mauiHeroToAll,
      mauiDemigod,
      magicBroomBucketBrigade,
      hadesKingOfOlympus,
      aladdinStreetRat,
      bePrepared,
      befuddle,
      friendsOnTheOtherSide,
      hakunaMatata,
      aWholeNewWorld,
      youHaveForgottenMe,
      controlYourTemper,
      shieldOfVirtue,
      dinglehopper,
      stitchRockStar,
      elsaGlovesOff,
      peterPansShadowNotSewnOn,
      mickeyMouseTrueFriend,
      arielSingingMermaid,
      developYourBrain,
      motherKnowsBest,
      smash,
    ],
    discard: [
      arielOnHumanLegs,
      arielWhoseitCollector,
      goofyMusketeer,
      mickeyMouseBraveLittleTailor,
      mickeyMouseWaywardSorcerer,
      rapunzelGiftedWithHealing,
      tinkerBellPeterPansAlly,
      stitchNewDog,
      stitchAbomination,
      elsaQueenRegent,
      maleficentBidingHerTime,
      maleficentSorceress,
      princePhillipDragonslayer,
      mulanImperialSoldier,
      mauiHeroToAll,
      mauiDemigod,
      magicBroomBucketBrigade,
      hadesKingOfOlympus,
      aladdinStreetRat,
      bePrepared,
      befuddle,
      friendsOnTheOtherSide,
      hakunaMatata,
      aWholeNewWorld,
      youHaveForgottenMe,
      controlYourTemper,
      shieldOfVirtue,
      dinglehopper,
    ],
    hand: [mauiHeroToAll, bePrepared],
    inkwell: 14,
    lore: 7,
    play: [
      hiddenCoveTranquilHaven,
      kuzcosPalaceHomeOfTheEmperor,
      prideLandsPrideRock,
      coconutBasket,
      {
        card: demonaBetrayerOfTheClan,
        atLocation: kuzcosPalaceHomeOfTheEmperor,
      },
      { card: goliathClanLeader, atLocation: prideLandsPrideRock },
      {
        card: agustinMadrigalClumsyDad,
        atLocation: hiddenCoveTranquilHaven,
        exerted: true,
      },
      brunoMadrigalOutOfTheShadows,
      { card: almaMadrigalAcceptingGrandmother, exerted: true },
      { card: isabelaMadrigalGoldenChild, exerted: true },
    ],
  },
});
