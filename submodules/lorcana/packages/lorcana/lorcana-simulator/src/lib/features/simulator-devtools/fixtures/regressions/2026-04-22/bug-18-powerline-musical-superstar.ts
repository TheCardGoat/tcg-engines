import {
  heiheiBoatSnack,
  letItGo,
  aWholeNewWorld,
  mickeyMouseArtfulRogue,
  friendsOnTheOtherSide,
} from "@tcg/lorcana-cards/cards/001";
import { peteBadGuy } from "@tcg/lorcana-cards/cards/002";
import { powerlineMusicalSuperstar } from "@tcg/lorcana-cards/cards/009";
import { createFixture } from "../../fixture-factory.js";

export const bug18PowerlineMusicalSuperstar = createFixture({
  id: "bug-18-powerline-musical-superstar",
  name: "Bug 18 - Powerline, Musical Superstar",
  description:
    "NOT FIXED. Powerline in play with songs in hand and enough ink to either play normally or sing. QA should sing or play 'Let It Go' / 'A Whole New World' and observe incorrect behavior after singing.",
  playerOne: {
    play: [powerlineMusicalSuperstar],
    hand: [
      letItGo,
      aWholeNewWorld,
      heiheiBoatSnack,
      friendsOnTheOtherSide,
      powerlineMusicalSuperstar,
    ],
    inkwell: 8,
    deck: [heiheiBoatSnack, heiheiBoatSnack, heiheiBoatSnack],
  },
  playerTwo: {
    play: [mickeyMouseArtfulRogue],
    deck: [peteBadGuy, peteBadGuy, peteBadGuy],
  },
  seed: "bug-18-powerline-musical-superstar",
  skipPreGame: true,
});
