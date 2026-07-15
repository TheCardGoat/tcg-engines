// Import cards from @tcg/lorcana-cards
// Note: We import from set indices which re-export all card types
import * as set001 from "@tcg/lorcana-cards/cards/001";
import * as set002 from "@tcg/lorcana-cards/cards/002";
import * as set009 from "@tcg/lorcana-cards/cards/009";

// Destructure only the cards used by the fixtures
export const {
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
} = set001;

export const { merlinGoat, rapunzelGiftedArtist } = set002;

export const {
  stitchRockStar,
  elsaGlovesOff,
  peterPansShadowNotSewnOn,
  mickeyMouseTrueFriend,
  arielSingingMermaid,
  developYourBrain,
  motherKnowsBest,
  smash,
} = set009;
