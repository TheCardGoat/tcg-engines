import {
  befuddle,
  friendsOnTheOtherSide,
  goofyDaredevil,
  liloMakingAWish,
  mickeyMouseTrueFriend,
  moanaChosenByTheOcean,
  simbaProtectiveCub,
  simbaReturnedKing,
  stitchNewDog,
} from "@tcg/lorcana-cards/cards/001";
import { bibbidiBobbidiBoo, flynnRiderConfidentVagabond } from "@tcg/lorcana-cards/cards/002";
import { underTheSea } from "@tcg/lorcana-cards/cards/004";
import { tianaRestaurantOwner } from "@tcg/lorcana-cards/cards/006";
import { theReturnOfHercules } from "@tcg/lorcana-cards/cards/007";
import { mirabelMadrigalCuriousChild } from "@tcg/lorcana-cards/cards/008";
import { hadesLookingForADeal, cheshireCatInexplicable } from "@tcg/lorcana-cards/cards/010";
import { kristoffsLute } from "@tcg/lorcana-cards/cards/011";
import {
  daleExcitedFriend,
  hammPiggyBank,
  lyleTiberiusRourkeAdventurerForHire,
  sidPhillipsToySurgeon,
  theLeviathanGuardianOfAtlantis,
  windupFrogSidsToy,
} from "@tcg/lorcana-cards/cards/012";
import { createFixture } from "./fixture-factory";

export const triage20260517TianaDaleBotChallengeFixture = createFixture({
  id: "triage-2026-05-17-tiana-dale-bot-challenge",
  name: "Triage 2026-05-17 - Tiana and Dale challenge validation",
  description:
    "Visual validation for R2, game game-1778915049625-vb6bksq65. P1 controls Dale - Excited Friend with 3 ink. P2 controls exerted Tiana - Restaurant Owner and an exerted Mickey Mouse. Challenge Mickey with Dale. Expected: Tiana's SPECIAL RESERVATION prompt clearly offers the challenger either pay 3 ink or take -3 strength before combat damage; this fixture is for validating the UI/bot decision surface, not a card-definition fix.",
  skipPreGame: true,
  playerOne: {
    inkwell: 3,
    hand: [],
    play: [{ card: daleExcitedFriend, isDrying: false }],
    deck: 10,
    lore: 0,
  },
  playerTwo: {
    hand: [],
    play: [
      { card: tianaRestaurantOwner, isDrying: false, exerted: true },
      { card: mickeyMouseTrueFriend, isDrying: false, exerted: true },
    ],
    deck: 10,
    lore: 0,
  },
  seed: "triage-2026-05-17-tiana-dale-bot-challenge",
});

export const triage20260517KristoffsLutePlayTopFixture = createFixture({
  id: "triage-2026-05-17-kristoffs-lute-play-top",
  name: "Triage 2026-05-17 - Kristoff's Lute play top card",
  description:
    "Visual validation for R5, game mgmSe8nSmmA9Y1XfygT7LoD. Activate Kristoff's Lute with Lilo - Making a Wish on top of the deck. Expected: the reveal prompt offers a playable option for Lilo, and choosing it plays Lilo instead of forcing the discard option.",
  skipPreGame: true,
  playerOne: {
    inkwell: 3,
    hand: [],
    play: [kristoffsLute],
    deck: [liloMakingAWish, stitchNewDog],
    lore: 0,
  },
  playerTwo: {
    hand: [],
    play: [],
    deck: 10,
    lore: 0,
  },
  seed: "triage-2026-05-17-kristoffs-lute-play-top",
});

export const triage20260517LeviathanReturnOfHerculesFixture = createFixture({
  id: "triage-2026-05-17-leviathan-return-of-hercules",
  name: "Triage 2026-05-17 - Leviathan via Return of Hercules",
  description:
    "Visual validation for R6/R7, games mgU_ohnBSpmzi0OpwtQ9jIr and mgIIWaYi9CzTdE2NDmx3i9Y. Play both Befuddles first so 2 cards enter P1's discard this turn, then play The Return of Hercules and use it to play The Leviathan for free. Expected: Leviathan's optional trigger can be accepted, opposing characters can be selected up to the 10-strength budget, and unselecting a target does not accidentally decline the optional trigger.",
  skipPreGame: true,
  playerOne: {
    inkwell: 7,
    hand: [befuddle, befuddle, theReturnOfHercules, theLeviathanGuardianOfAtlantis],
    play: [],
    deck: 10,
    lore: 0,
  },
  playerTwo: {
    hand: [],
    play: [
      { card: simbaProtectiveCub, isDrying: false },
      { card: liloMakingAWish, isDrying: false },
      { card: goofyDaredevil, isDrying: false },
    ],
    deck: 10,
    lore: 0,
  },
  seed: "triage-2026-05-17-leviathan-return-of-hercules",
});

export const triage20260517HammPiggyBankExertFixture = createFixture({
  id: "triage-2026-05-17-hamm-piggy-bank-exert",
  name: "Triage 2026-05-17 - Hamm Piggy Bank exert option",
  description:
    "Visual validation for R12, game mgSZZn_DHQso8CQeuxHC5cw. P1 has a dry Hamm - Piggy Bank, 2 ink, and Mickey Mouse - True Friend in hand. Expected: Hamm's LOOSE CHANGE exert ability is available; after using it, Mickey can be played with the 1-ink reduction.",
  skipPreGame: true,
  playerOne: {
    inkwell: 2,
    hand: [mickeyMouseTrueFriend],
    play: [{ card: hammPiggyBank, isDrying: false }],
    deck: 10,
    lore: 0,
  },
  playerTwo: {
    hand: [],
    play: [],
    deck: 10,
    lore: 0,
  },
  seed: "triage-2026-05-17-hamm-piggy-bank-exert",
});

export const triage20260517MirabelCuriousChildRevealFixture = createFixture({
  id: "triage-2026-05-17-mirabel-curious-child-reveal",
  name: "Triage 2026-05-17 - Mirabel Curious Child reveal song",
  description:
    "Visual validation for R13/R21/R30 plus replay mgPhI4ZWHvdLtbIVE-jXmRj turn 11. In mobile responsive mode, play Mirabel Madrigal - Curious Child, accept YOU ARE A WONDER, and select Friends on the Other Side from hand. Expected: the optional prompt appears and can be accepted, the song is visibly selectable, the confirm action becomes visible/enabled after selection, the song is revealed, P1 gains 1 lore, and the mobile hand/prompt/confirm controls do not clip or overlap.",
  skipPreGame: true,
  playerOne: {
    inkwell: mirabelMadrigalCuriousChild.cost,
    hand: [mirabelMadrigalCuriousChild, friendsOnTheOtherSide],
    play: [],
    deck: 10,
    lore: 0,
  },
  playerTwo: {
    hand: [],
    play: [],
    deck: 10,
    lore: 0,
  },
  seed: "triage-2026-05-17-mirabel-curious-child-reveal",
});

export const triage20260517BibbidiAnotherCharacterFixture = createFixture({
  id: "triage-2026-05-17-bibbidi-another-character",
  name: "Triage 2026-05-17 - Bibbidi requires another character",
  description:
    "Visual validation for R15, game mgROtD79El-bAfC4PoFxzMt. Cast Bibbidi Bobbidi Boo and return Flynn Rider - Confident Vagabond. Expected: the follow-up free-play picker must not offer the same returned Flynn card, because Bibbidi says to play another character with the same cost or less.",
  skipPreGame: true,
  playerOne: {
    inkwell: bibbidiBobbidiBoo.cost,
    hand: [bibbidiBobbidiBoo, liloMakingAWish],
    play: [{ card: flynnRiderConfidentVagabond, isDrying: false }],
    deck: 10,
    lore: 0,
  },
  playerTwo: {
    hand: [],
    play: [],
    deck: 10,
    lore: 0,
  },
  seed: "triage-2026-05-17-bibbidi-another-character",
});

export const triage20260517HadesTargetClarityFixture = createFixture({
  id: "triage-2026-05-17-hades-target-clarity",
  name: "Triage 2026-05-17 - Hades target clarity",
  description:
    "Visual validation for R18, game mgLRYqwzW5Evso46iNsA8ML. Play Hades - Looking for a Deal and choose one of two opposing characters. Expected: the selected character remains visually clear while the opponent chooses whether to bottom that character or let P1 draw 2.",
  skipPreGame: true,
  playerOne: {
    inkwell: hadesLookingForADeal.cost,
    hand: [hadesLookingForADeal],
    play: [],
    deck: 10,
    lore: 0,
  },
  playerTwo: {
    hand: [],
    play: [
      { card: simbaProtectiveCub, isDrying: false },
      { card: mickeyMouseTrueFriend, isDrying: false },
    ],
    deck: 10,
    lore: 0,
  },
  seed: "triage-2026-05-17-hades-target-clarity",
});

export const triage20260517CheshireCatBoostMoveOneFixture = createFixture({
  id: "triage-2026-05-17-cheshire-cat-boost-move-one",
  name: "Triage 2026-05-17 - Cheshire Cat Boost move one damage",
  description:
    "Visual validation for R8/R19, games game-1778940835595-j22xxbwh7 and mgX28M_HsdDloODk4wrE7G-. Activate Cheshire Cat - Inexplicable's Boost, accept IT'S LOADS OF FUN, then move only 1 of Lilo's 2 damage to Mickey. Expected: the UI supports an up-to-2 amount choice, including moving exactly 1 damage instead of forcing 2.",
  skipPreGame: true,
  playerOne: {
    inkwell: 2,
    hand: [],
    play: [
      { card: cheshireCatInexplicable, isDrying: false },
      { card: liloMakingAWish, isDrying: false, damage: 2 },
    ],
    deck: [stitchNewDog],
    lore: 0,
  },
  playerTwo: {
    hand: [],
    play: [{ card: mickeyMouseTrueFriend, isDrying: false }],
    deck: 10,
    lore: 0,
  },
  seed: "triage-2026-05-17-cheshire-cat-boost-move-one",
});

export const triage20260517WindUpFrogToyBanishFixture = createFixture({
  id: "triage-2026-05-17-wind-up-frog-toy-banish",
  name: "Triage 2026-05-17 - Wind-Up Frog Toy banish discount",
  description:
    "Visual validation for R24, game mgihdxdTZ6LLUNYi_vwbXmq. P1 has Wind-Up Frog - Sid's Toy in hand with 0 ink and Hamm in play. Challenge the exerted Goofy with Hamm so Hamm is banished in combat. Expected: Wind-Up Frog becomes playable for free after one of your Toy characters is banished this turn.",
  skipPreGame: true,
  playerOne: {
    inkwell: 0,
    hand: [windupFrogSidsToy],
    play: [{ card: hammPiggyBank, isDrying: false }],
    deck: 10,
    lore: 0,
  },
  playerTwo: {
    hand: [],
    play: [{ card: simbaReturnedKing, isDrying: false, exerted: true }],
    deck: 10,
    lore: 0,
  },
  seed: "triage-2026-05-17-wind-up-frog-toy-banish",
});

export const triage20260517LyleDirtyTricksFixture = createFixture({
  id: "triage-2026-05-17-lyle-dirty-tricks",
  name: "Triage 2026-05-17 - Lyle Dirty Tricks end turn",
  description:
    "Visual validation for R26, game mgfygMiKLn39tocvUbWjjzE. P1 has Lyle Tiberius Rourke - Adventurer for Hire in play and two Befuddles in hand. Play both Befuddles so 2 cards enter P1's discard this turn, then end the turn. Expected: DIRTY TRICKS triggers at end of turn and P2 loses 1 lore; if Lyle is in discard instead of play, no trigger should appear.",
  skipPreGame: true,
  playerOne: {
    inkwell: 2,
    hand: [befuddle, befuddle],
    play: [{ card: lyleTiberiusRourkeAdventurerForHire, isDrying: false }],
    deck: 10,
    lore: 0,
  },
  playerTwo: {
    hand: [],
    play: [
      { card: simbaProtectiveCub, isDrying: false },
      { card: liloMakingAWish, isDrying: false },
    ],
    deck: 10,
    lore: 5,
  },
  seed: "triage-2026-05-17-lyle-dirty-tricks",
});

export const triage20260517SidDoublePrizesFixture = createFixture({
  id: "triage-2026-05-17-sid-double-prizes",
  name: "Triage 2026-05-17 - Sid Double Prizes",
  description:
    "Visual validation for R27, game mgb8SeNGg9rcir5ILzWGLgB. Play Sid Phillips - Toy Surgeon, choose your Hamm for PLAYTIME'S OVER, then have P2 choose Wind-Up Frog. Expected: Sid's DOUBLE PRIZES! gives 2 lore for each Toy character banished during P1's turn, including the opponent's Toy banished by the follow-up choice.",
  skipPreGame: true,
  playerOne: {
    inkwell: sidPhillipsToySurgeon.cost,
    hand: [sidPhillipsToySurgeon],
    play: [{ card: hammPiggyBank, isDrying: false }],
    deck: 10,
    lore: 0,
  },
  playerTwo: {
    hand: [],
    play: [
      { card: windupFrogSidsToy, isDrying: false },
      { card: daleExcitedFriend, isDrying: false },
    ],
    deck: 10,
    lore: 0,
  },
  seed: "triage-2026-05-17-sid-double-prizes",
});

export const triage20260517UnderTheSeaSingTogetherFixture = createFixture({
  id: "triage-2026-05-17-under-the-sea-sing-together",
  name: "Triage 2026-05-17 - Under the Sea Sing Together",
  description:
    "Visual validation for R32, game mgUHtYhWrVFQd5P3zeL2GmY. P1 has Under the Sea in hand and ready Moana - Chosen by the Ocean plus Simba - Returned King in play. Expected: Sing Together 8 allows exerting both characters because their total cost is at least 8, then opposing low-strength characters go to the bottom of the deck.",
  skipPreGame: true,
  playerOne: {
    inkwell: 0,
    hand: [underTheSea],
    play: [
      { card: moanaChosenByTheOcean, isDrying: false },
      { card: simbaReturnedKing, isDrying: false },
    ],
    deck: 10,
    lore: 0,
  },
  playerTwo: {
    hand: [],
    play: [
      { card: simbaProtectiveCub, isDrying: false },
      { card: liloMakingAWish, isDrying: false },
    ],
    deck: 10,
    lore: 0,
  },
  seed: "triage-2026-05-17-under-the-sea-sing-together",
});
