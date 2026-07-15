import { mickeyMouseTrueFriend, simbaProtectiveCub } from "@tcg/lorcana-cards/cards/001";
import { pawpsicle } from "@tcg/lorcana-cards/cards/002";
import { angelExperiment624 } from "@tcg/lorcana-cards/cards/011";
import { andysRoomHomeBase } from "@tcg/lorcana-cards/cards/012";
import {
  darkwingDuckShadowySuperhero,
  flynnRiderHighclimbingRogue,
  lookWhatYouveDone,
  maximusRelentlessStallion,
  maximusRelentlessStallionPD1Promo,
  megavoltElectricalMenace,
  motherGothelEvilAsEver,
  mulanCreatedByTheVine,
  mulanCreatedByTheVineEpic,
  omnidroidScanningForThreats,
  omnidroidUltimateIteration,
  propheticVision,
  rapunzelFlynnRiderUnlikelyPair,
  sproutExperiment509,
  theVineToweringStalk,
  willieTheGiantCreatedByTheVine,
  withAFewGoodFriends,
} from "@tcg/lorcana-cards/cards/013";
import { createFixture } from "./fixture-factory.js";

const readySteelCharacters = [
  maximusRelentlessStallionPD1Promo,
  willieTheGiantCreatedByTheVine,
  sproutExperiment509,
  megavoltElectricalMenace,
  darkwingDuckShadowySuperhero,
  omnidroidScanningForThreats,
  flynnRiderHighclimbingRogue,
  mulanCreatedByTheVine,
  maximusRelentlessStallion,
  omnidroidUltimateIteration,
  theVineToweringStalk,
  mulanCreatedByTheVineEpic,
].map((card) => ({ card, isDrying: false }));

const targetBoardCards = [
  { card: mickeyMouseTrueFriend, isDrying: false },
  { card: simbaProtectiveCub, isDrying: false, damage: 1 },
  pawpsicle,
  andysRoomHomeBase,
];

const reviewDiscard = [
  mickeyMouseTrueFriend,
  simbaProtectiveCub,
  pawpsicle,
  andysRoomHomeBase,
  lookWhatYouveDone,
  propheticVision,
];

const reviewDeck = [
  maximusRelentlessStallionPD1Promo,
  willieTheGiantCreatedByTheVine,
  sproutExperiment509,
  megavoltElectricalMenace,
  darkwingDuckShadowySuperhero,
  omnidroidScanningForThreats,
  flynnRiderHighclimbingRogue,
  mulanCreatedByTheVine,
  maximusRelentlessStallion,
  omnidroidUltimateIteration,
  theVineToweringStalk,
  mulanCreatedByTheVineEpic,
];

export const set13CharactersSteelBoardFixture = createFixture({
  id: "set13-characters-steel-board",
  name: "Set 13 Characters - Steel board tests",
  description:
    "Steel Set 13 character board-state fixture. The review characters start ready in play, and the active player has enough ink to play the support actions from hand.",
  seed: "set13-characters-steel-board",
  skipPreGame: true,
  playerOne: {
    hand: [
      lookWhatYouveDone,
      withAFewGoodFriends,
      propheticVision,
      lookWhatYouveDone,
      motherGothelEvilAsEver,
    ],
    play: [...readySteelCharacters, angelExperiment624, rapunzelFlynnRiderUnlikelyPair],
    discard: reviewDiscard,
    deck: reviewDeck,
    inkwell: 42,
    lore: 5,
  },
  playerTwo: {
    hand: [],
    play: targetBoardCards,
    discard: reviewDiscard,
    deck: [...reviewDeck].reverse(),
    inkwell: 30,
    lore: 5,
  },
});
