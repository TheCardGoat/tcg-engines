import { mickeyMouseTrueFriend, simbaProtectiveCub } from "@tcg/lorcana-cards/cards/001";
import { pawpsicle } from "@tcg/lorcana-cards/cards/002";
import { angelExperiment624 } from "@tcg/lorcana-cards/cards/011";
import { andysRoomHomeBase } from "@tcg/lorcana-cards/cards/012";
import {
  _4townHottestBandOfTheYear,
  abbyParkOverTheTop,
  antonioMadrigalAnimalDoctor,
  belleAlwaysReading,
  booHumanChild,
  charlesMuntzObsessiveExplorer,
  darkwingDuckLaunchpadStCanardsFinest,
  kocoumDefenderOfTheTribe,
  lookWhatYouveDone,
  maidMarianCreatedByTheVine,
  meilinLeeLeadVocalist,
  meilinLeeLeadVocalistP4Challenge,
  meilinLeeLosingControl,
  merlinEnvisioningTheFuturePD1Promo,
  mingLeeProudParent,
  miriamMendelsohnTicketHolder,
  plutoSuspiciousSentry,
  pocahontasGuidingTheTribePD1Promo,
  propheticVision,
  rabbitHunnyPaladin,
  randallBoggsScarySmart,
  randallBoggsScarySmartP4Challenge,
  withAFewGoodFriends,
  woodyHelpingAFriend,
  woodyTownSheriff,
} from "@tcg/lorcana-cards/cards/013";
import type { LorcanaCard } from "@tcg/lorcana-engine";
import { createFixture } from "./fixture-factory";

const fixtureId = "set13-characters-sapphire-board";
const fixtureName = "Set 13 Characters - Sapphire board tests";

const supportActions = [lookWhatYouveDone, withAFewGoodFriends, propheticVision];

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

export const set13CharactersSapphireBoardFixture = createFixture({
  id: fixtureId,
  name: fixtureName,
  description: buildDescription(fixtureName, set13CharactersSapphire),
  skipPreGame: true,
  playerOne: {
    hand: supportActions,
    play: [
      ...set13CharactersSapphire.map((card) => ({ card, isDrying: false })),
      angelExperiment624,
    ],
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
  seed: fixtureId,
});

function buildDescription(name: string, cards: LorcanaCard[]): string {
  const cardList = cards.map(formatCardForReview).join("; ");

  return `${name}. The chunk cards start in play and ready so static, quest, challenge, activated, and board-state abilities can be inspected immediately. Vanilla set13 cards are intentionally excluded. Shared support cards on the board provide friendly and opposing characters, an item, a location, damage, discard piles, and known decks for manual validation. Cards in this chunk: ${cardList}.`;
}

function formatCardForReview(card: LorcanaCard): string {
  return card.version ? `${card.name} - ${card.version}` : card.name;
}
