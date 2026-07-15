import {
  cheshireCatInexplicable,
  cantHoldItBackAnymore,
  balooFriendAndGuardian,
  gastonFrightfulBully,
  rajahDevotedProtector,
  simbaKingInTheMaking,
  arielEtherealVoice,
  mowgliManCub,
} from "@tcg/lorcana-cards/cards/010";
import { mickeyMouseTrueFriend } from "@tcg/lorcana-cards/cards/001";
import { createFixture } from "./fixture-factory";
import { ohanaMeansFamily } from "@tcg/lorcana-cards/cards/011";

export const moveDamageFixture = createFixture({
  id: "move-damage",
  name: "Move Damage Effects",
  description:
    "Test bed for move-damage effects: Cheshire Cat's IT'S LOADS OF FUN trigger and Can't Hold It Back Anymore action that moves all damage counters to a chosen opponent character.",
  skipPreGame: true,
  playerOne: {
    inkwell: 13,
    hand: [cantHoldItBackAnymore, ohanaMeansFamily],
    play: [
      { card: cheshireCatInexplicable, isDrying: false },
      { card: balooFriendAndGuardian, isDrying: false, damage: 2 },
      { card: simbaKingInTheMaking, isDrying: false, damage: 1 },
      { card: mowgliManCub, isDrying: false, damage: 3 },
    ],
  },
  playerTwo: {
    inkwell: 10,
    hand: [mickeyMouseTrueFriend],
    play: [
      { card: gastonFrightfulBully, isDrying: false, damage: 1 },
      { card: rajahDevotedProtector, isDrying: false },
      { card: arielEtherealVoice, isDrying: false, damage: 2 },
    ],
  },
});
