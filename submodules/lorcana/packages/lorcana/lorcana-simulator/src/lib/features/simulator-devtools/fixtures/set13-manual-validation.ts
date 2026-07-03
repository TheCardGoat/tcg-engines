import { mickeyMouseTrueFriend, simbaProtectiveCub } from "@tcg/lorcana-cards/cards/001";
import { pawpsicle } from "@tcg/lorcana-cards/cards/002";
import { angelExperiment624 } from "@tcg/lorcana-cards/cards/011";
import { andysRoomHomeBase } from "@tcg/lorcana-cards/cards/012";
import {
  _4townHottestBandOfTheYear,
  abbyParkOverTheTop,
  aladdinGenieMischievousPals,
  antonioMadrigalAnimalDoctor,
  beastFierceDefender,
  belleAlwaysReading,
  belleBeastCertainAsTheSun,
  belleBeastCertainAsTheSunIconic,
  bestiesAssemble,
  bigBookOfHunny,
  booEnergeticChild,
  booEnergeticChildPD1Promo,
  booHumanChild,
  bunchOfBalloons,
  buzzLightyearGrounded,
  buzzLightyearProvidingCoverPD1Promo,
  captainHookConnivingPirate,
  carlFredricksenLovingHusband,
  carlFredricksenOnTheMove,
  carlFredricksenRussellIntrepidExplorers,
  carlsHouseFlyingHigh,
  charlesMuntzObsessiveExplorer,
  christopherRobinHunnySage,
  colonelHathiOnTheMarch,
  darkwingDuckLaunchpadStCanardsFinest,
  darkwingDuckShadowySuperhero,
  discardedArmor,
  donaldDuckVinelingRider,
  drBushrootEvilBotanist,
  ellieFredricksenLovingWife,
  fflewddurFflamLucklessBard,
  flynnRiderHighclimbingRogue,
  gastonCreatedByTheVine,
  genieHardToGrasp,
  gopherHunnyCook,
  heraCreatedByTheVine,
  ifIDidntHaveYou,
  imNeverNotByYourSide,
  kangaHunnyBard,
  kevinFlightlessBird,
  kocoumDefenderOfTheTribe,
  liloStitchFunlovingFriends,
  liloStitchFunlovingFriendsIconic,
  lookWhatYouveDone,
  magicalHunnyStaff,
  maidMarianCreatedByTheVine,
  maleficentDiabloEvilIncarnate,
  maximusRelentlessStallion,
  maximusRelentlessStallionPD1Promo,
  megavoltElectricalMenace,
  meilinLeeLeadVocalist,
  meilinLeeLeadVocalistP4Challenge,
  meilinLeeLosingControl,
  meilinLeePopularRedPanda,
  meilinLeePopularRedPandaEnchanted,
  meilinLeeSuperficiallyObedient,
  meridaWispConjurer,
  merlinEnvisioningTheFuturePD1Promo,
  mickeyMouseMinnieMouseAdventuringDuo,
  mikeWazowskiHeroicClimber,
  mikeWazowskiHeroicClimberEnchanted,
  mingLeeGiantRedPanda,
  mingLeeOverprotectiveParent,
  mingLeeProudParent,
  mirabelMadrigalFamilyGuardian,
  miriamMendelsohnTicketHolder,
  morphLittleImitator,
  morphLittleImitatorP4Challenge,
  motherGothelEvilAsEver,
  mrsIncredibleCreatedByTheVine,
  mrsIncredibleCreatedByTheVineEpic,
  mulanCreatedByTheVine,
  mulanCreatedByTheVineEpic,
  myAdventureBook,
  nobodyLikeU,
  omnidroidScanningForThreats,
  omnidroidUltimateIteration,
  oneAndOnly,
  pachaPanickedCustomer,
  painRunningWithScissors,
  panicHammerEnthusiast,
  paradiseFallsExoticDestination,
  peteCreatedByTheVine,
  peterPanCreatedByTheVineEpic,
  peterPanPlayfulPrankster,
  peterPanTinkerBellFastFriends,
  piercingAttack,
  plutoSuspiciousSentry,
  pocahontasGuidingTheTribePD1Promo,
  powhatansStaff,
  powerSurge,
  propheticVision,
  protectiveAura,
  putThatThingBack,
  rabbitHunnyPaladin,
  randallBoggsEnviousCoworker,
  randallBoggsScarySmart,
  randallBoggsScarySmartP4Challenge,
  rapunzelEscapingTheTower,
  rapunzelEscapingTheTowerP4ChallengeP4015RapunzelEscapingTheTowerChallenge,
  rapunzelEscapingTheTowerP4ChallengeP4016RapunzelEscapingTheTowerChallenge,
  rapunzelFlynnRiderUnlikelyPair,
  rapunzelsTowerTakenByTheVine,
  rapunzelTowerDefender,
  rahr,
  ringOfStonesTakenByTheVine,
  rooHunnyRogue,
  russellSeniorWildernessExplorer,
  scoutAhead,
  screamCanister,
  sproutExperiment509,
  startle,
  sulleyBooScareBuddies,
  sulleyProtectiveMonster,
  sulleyTheNewBoss,
  sunYeeRedPandaSpirit,
  theHornedKingMercilessMaster,
  theMadrigalFamilyEveryGeneration,
  theVineToweringStalk,
  tiggerHunnyBarbarian,
  translationCollar,
  ursulaCreatedByTheVine,
  vixeyExpertFisherPD1Promo,
  willieTheGiantCreatedByTheVine,
  windstorm,
  winifredExasperatedElephant,
  winnieThePoohHunnyArchmage,
  withAFewGoodFriends,
  woodyBuzzLightyearBestBuddies,
  woodyHelpingAFriend,
  woodyTownSheriff,
  youBrokeMySmolder,
} from "@tcg/lorcana-cards/cards/013";
import type { LorcanaCard } from "@tcg/lorcana-engine";
import { createFixture } from "./fixture-factory";

const supportActions = [lookWhatYouveDone, withAFewGoodFriends, propheticVision];

const targetBoardCards = [
  { card: mickeyMouseTrueFriend, isDrying: false },
  { card: simbaProtectiveCub, isDrying: false, exerted: true, damage: 1 },
  pawpsicle,
  andysRoomHomeBase,
];

const playerOneSupportBoard = [
  { card: mickeyMouseTrueFriend, isDrying: false },
  { card: simbaProtectiveCub, isDrying: false },
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
  woodyHelpingAFriend,
  mingLeeProudParent,
  pocahontasGuidingTheTribePD1Promo,
  rabbitHunnyPaladin,
  meilinLeeLeadVocalist,
  miriamMendelsohnTicketHolder,
  meilinLeeLeadVocalistP4Challenge,
  kocoumDefenderOfTheTribe,
  woodyTownSheriff,
  abbyParkOverTheTop,
  meilinLeeLosingControl,
  _4townHottestBandOfTheYear,
];

const set13ActionsAmberSteel = [
  ifIDidntHaveYou,
  imNeverNotByYourSide,
  bestiesAssemble,
  nobodyLikeU,
  lookWhatYouveDone,
  youBrokeMySmolder,
  windstorm,
];

const set13ActionsAmethystEmerald = [
  withAFewGoodFriends,
  oneAndOnly,
  protectiveAura,
  piercingAttack,
  putThatThingBack,
  scoutAhead,
];

const set13ActionsRubySapphire = [rahr, propheticVision, powerSurge, startle];

const set13ItemsLocations = [
  powhatansStaff,
  rapunzelsTowerTakenByTheVine,
  magicalHunnyStaff,
  ringOfStonesTakenByTheVine,
  myAdventureBook,
  paradiseFallsExoticDestination,
  screamCanister,
  bunchOfBalloons,
  carlsHouseFlyingHigh,
  translationCollar,
  bigBookOfHunny,
  discardedArmor,
];

const set13CharactersAmber = [
  woodyHelpingAFriend,
  mingLeeProudParent,
  pocahontasGuidingTheTribePD1Promo,
  rabbitHunnyPaladin,
  meilinLeeLeadVocalist,
  miriamMendelsohnTicketHolder,
  meilinLeeLeadVocalistP4Challenge,
  kocoumDefenderOfTheTribe,
  woodyTownSheriff,
  abbyParkOverTheTop,
  meilinLeeLosingControl,
  _4townHottestBandOfTheYear,
  mikeWazowskiHeroicClimber,
  theHornedKingMercilessMaster,
  kangaHunnyBard,
  sulleyTheNewBoss,
  mirabelMadrigalFamilyGuardian,
  ursulaCreatedByTheVine,
  woodyBuzzLightyearBestBuddies,
  sulleyBooScareBuddies,
  theMadrigalFamilyEveryGeneration,
  liloStitchFunlovingFriends,
  mikeWazowskiHeroicClimberEnchanted,
  liloStitchFunlovingFriendsIconic,
];

const set13CharactersAmethyst = [
  vixeyExpertFisherPD1Promo,
  morphLittleImitatorP4Challenge,
  fflewddurFflamLucklessBard,
  winnieThePoohHunnyArchmage,
  panicHammerEnthusiast,
  meilinLeeSuperficiallyObedient,
  genieHardToGrasp,
  painRunningWithScissors,
  mingLeeOverprotectiveParent,
  meridaWispConjurer,
  mrsIncredibleCreatedByTheVine,
  peteCreatedByTheVine,
  heraCreatedByTheVine,
  morphLittleImitator,
  peterPanPlayfulPrankster,
  aladdinGenieMischievousPals,
  peterPanTinkerBellFastFriends,
  christopherRobinHunnySage,
  maleficentDiabloEvilIncarnate,
  mrsIncredibleCreatedByTheVineEpic,
];

const set13CharactersEmerald = [
  buzzLightyearProvidingCoverPD1Promo,
  rapunzelEscapingTheTowerP4ChallengeP4015RapunzelEscapingTheTowerChallenge,
  rapunzelEscapingTheTowerP4ChallengeP4016RapunzelEscapingTheTowerChallenge,
  carlFredricksenLovingHusband,
  ellieFredricksenLovingWife,
  buzzLightyearGrounded,
  gopherHunnyCook,
  russellSeniorWildernessExplorer,
  rapunzelTowerDefender,
  rooHunnyRogue,
  winifredExasperatedElephant,
  kevinFlightlessBird,
  drBushrootEvilBotanist,
  motherGothelEvilAsEver,
  rapunzelEscapingTheTower,
  carlFredricksenRussellIntrepidExplorers,
  mickeyMouseMinnieMouseAdventuringDuo,
  rapunzelFlynnRiderUnlikelyPair,
  peterPanCreatedByTheVineEpic,
];

const set13CharactersRuby = [
  booEnergeticChildPD1Promo,
  carlFredricksenOnTheMove,
  gastonCreatedByTheVine,
  colonelHathiOnTheMarch,
  pachaPanickedCustomer,
  sunYeeRedPandaSpirit,
  beastFierceDefender,
  randallBoggsEnviousCoworker,
  donaldDuckVinelingRider,
  meilinLeePopularRedPanda,
  tiggerHunnyBarbarian,
  booEnergeticChild,
  sulleyProtectiveMonster,
  mingLeeGiantRedPanda,
  captainHookConnivingPirate,
  belleBeastCertainAsTheSun,
  meilinLeePopularRedPandaEnchanted,
  belleBeastCertainAsTheSunIconic,
];

const set13CharactersSapphire = [
  merlinEnvisioningTheFuturePD1Promo,
  randallBoggsScarySmartP4Challenge,
  belleAlwaysReading,
  randallBoggsScarySmart,
  antonioMadrigalAnimalDoctor,
  maidMarianCreatedByTheVine,
  booHumanChild,
  plutoSuspiciousSentry,
  charlesMuntzObsessiveExplorer,
  darkwingDuckLaunchpadStCanardsFinest,
];

const set13CharactersSteel = [
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

export const SET13_MANUAL_VALIDATION_FIXTURE_IDS = [
  "set13-actions-amber-steel",
  "set13-actions-amethyst-emerald",
  "set13-actions-ruby-sapphire",
  "set13-items-locations",
  "set13-characters-amber-play",
  "set13-characters-amethyst-play",
  "set13-characters-emerald-play",
  "set13-characters-ruby-play",
  "set13-characters-sapphire-play",
  "set13-characters-steel-play",
  "set13-characters-amber-board",
  "set13-characters-amethyst-board",
  "set13-characters-emerald-board",
  "set13-characters-ruby-board",
  "set13-characters-sapphire-board",
  "set13-characters-steel-board",
] as const;

export const set13ActionsAmberSteelFixture = createSet13PlayFixture({
  id: "set13-actions-amber-steel",
  name: "Set 13 Actions - Amber and Steel",
  cards: set13ActionsAmberSteel,
});

export const set13ActionsAmethystEmeraldFixture = createSet13PlayFixture({
  id: "set13-actions-amethyst-emerald",
  name: "Set 13 Actions - Amethyst and Emerald",
  cards: set13ActionsAmethystEmerald,
});

export const set13ActionsRubySapphireFixture = createSet13PlayFixture({
  id: "set13-actions-ruby-sapphire",
  name: "Set 13 Actions - Ruby and Sapphire",
  cards: set13ActionsRubySapphire,
});

export const set13ItemsLocationsFixture = createSet13PlayFixture({
  id: "set13-items-locations",
  name: "Set 13 Items and Locations",
  cards: set13ItemsLocations,
});

export const set13CharactersAmberPlayFixture = createSet13PlayFixture({
  id: "set13-characters-amber-play",
  name: "Set 13 Characters - Amber play tests",
  cards: set13CharactersAmber,
});

export const set13CharactersAmethystPlayFixture = createSet13PlayFixture({
  id: "set13-characters-amethyst-play",
  name: "Set 13 Characters - Amethyst play tests",
  cards: set13CharactersAmethyst,
});

export const set13CharactersEmeraldPlayFixture = createSet13PlayFixture({
  id: "set13-characters-emerald-play",
  name: "Set 13 Characters - Emerald play tests",
  cards: set13CharactersEmerald,
});

export const set13CharactersRubyPlayFixture = createSet13PlayFixture({
  id: "set13-characters-ruby-play",
  name: "Set 13 Characters - Ruby play tests",
  cards: set13CharactersRuby,
});

export const set13CharactersSapphirePlayFixture = createSet13PlayFixture({
  id: "set13-characters-sapphire-play",
  name: "Set 13 Characters - Sapphire play tests",
  cards: set13CharactersSapphire,
});

export const set13CharactersSteelPlayFixture = createSet13PlayFixture({
  id: "set13-characters-steel-play",
  name: "Set 13 Characters - Steel play tests",
  cards: set13CharactersSteel,
});

export const set13CharactersAmberBoardFixture = createSet13BoardFixture({
  id: "set13-characters-amber-board",
  name: "Set 13 Characters - Amber board tests",
  cards: set13CharactersAmber,
});

export const set13CharactersAmethystBoardFixture = createSet13BoardFixture({
  id: "set13-characters-amethyst-board",
  name: "Set 13 Characters - Amethyst board tests",
  cards: set13CharactersAmethyst,
});

export const set13CharactersEmeraldBoardFixture = createSet13BoardFixture({
  id: "set13-characters-emerald-board",
  name: "Set 13 Characters - Emerald board tests",
  cards: set13CharactersEmerald,
});

export const set13CharactersRubyBoardFixture = createSet13BoardFixture({
  id: "set13-characters-ruby-board",
  name: "Set 13 Characters - Ruby board tests",
  cards: set13CharactersRuby,
});

export const set13CharactersSapphireBoardFixture = createSet13BoardFixture({
  id: "set13-characters-sapphire-board",
  name: "Set 13 Characters - Sapphire board tests",
  cards: set13CharactersSapphire,
});

export const set13CharactersSteelBoardFixture = createSet13BoardFixture({
  id: "set13-characters-steel-board",
  name: "Set 13 Characters - Steel board tests",
  cards: set13CharactersSteel,
});

function createSet13PlayFixture(input: {
  id: (typeof SET13_MANUAL_VALIDATION_FIXTURE_IDS)[number];
  name: string;
  cards: LorcanaCard[];
}) {
  return createFixture({
    id: input.id,
    name: input.name,
    description: buildDescription(input.name, "play-from-hand", input.cards),
    skipPreGame: true,
    playerOne: {
      hand: [...input.cards, ...supportActions],
      play: [...playerOneSupportBoard, angelExperiment624],
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
    seed: input.id,
  });
}

function createSet13BoardFixture(input: {
  id: (typeof SET13_MANUAL_VALIDATION_FIXTURE_IDS)[number];
  name: string;
  cards: LorcanaCard[];
}) {
  return createFixture({
    id: input.id,
    name: input.name,
    description: buildDescription(input.name, "board-state", input.cards),
    skipPreGame: true,
    playerOne: {
      hand: supportActions,
      play: [...input.cards.map((card) => ({ card, isDrying: false })), angelExperiment624],
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
    seed: input.id,
  });
}

function buildDescription(
  name: string,
  mode: "play-from-hand" | "board-state",
  cards: LorcanaCard[],
): string {
  const cardList = cards.map(formatCardForReview).join("; ");
  const modeDescription =
    mode === "board-state"
      ? "The chunk cards start in play and ready so static, quest, challenge, activated, and board-state abilities can be inspected immediately."
      : "The chunk cards start in hand with 99 ink so reviewers can play each card and inspect play, modal, target, reveal, and resolution prompts.";

  return `${name}. ${modeDescription} Vanilla set13 cards are intentionally excluded. Shared support cards on the board provide friendly and opposing characters, an item, a location, damage, discard piles, and known decks for manual validation. Cards in this chunk: ${cardList}.`;
}

function formatCardForReview(card: LorcanaCard): string {
  return card.version ? `${card.name} - ${card.version}` : card.name;
}
