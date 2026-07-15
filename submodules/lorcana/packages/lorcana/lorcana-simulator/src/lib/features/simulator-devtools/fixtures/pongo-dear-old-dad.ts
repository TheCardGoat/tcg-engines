import { createFixture } from "./fixture-factory";
import {
  frecklesGoodBoy,
  luckyRuntOfTheLitter,
  perditaPlayfulMother,
  pongoDearOldDad,
} from "@tcg/lorcana-cards/cards/007";
import { mickeyMouseTrueFriend, reflection, dragonFire } from "@tcg/lorcana-cards/cards/001";

// Scenario: Pongo is in play, Puppy characters are in the inkwell.
// At the start of playerOne's turn, Pongo triggers "FOUND YOU, YOU LITTLE RASCAL":
// look at inkwell, optionally play a Puppy character for free.
export const pongoDearOldDadFixture = createFixture({
  id: "pongo-dear-old-dad",
  name: "Pongo - Dear Old Dad (Inkwell Puppy Play)",
  description:
    "Pongo sits in play. Three Puppy characters (Freckles, Lucky, Perdita) and two non-Puppy cards are in the inkwell. " +
    "At the start of playerOne's turn, Pongo's ability triggers — look at the inkwell and optionally play a Puppy for free.",
  skipPreGame: true,
  playerOne: {
    inkwell: [frecklesGoodBoy, luckyRuntOfTheLitter, perditaPlayfulMother, reflection, dragonFire],
    hand: [],
    play: [pongoDearOldDad],
    deck: 5,
  },
  playerTwo: {
    hand: [mickeyMouseTrueFriend],
    play: [],
    deck: 5,
  },
});
