import { heiheiBoatSnack, belleStrangeButSpecial } from "@tcg/lorcana-cards/cards/001";
import { madamMimSnake, peteBadGuy } from "@tcg/lorcana-cards/cards/002";
import { meekoSkittishScrounger } from "@tcg/lorcana-cards/cards/011";
import { createFixture } from "../../fixture-factory.js";

export const bug13MeekoSkittishScrounger = createFixture({
  id: "bug-13-meeko-skittish-scrounger",
  name: "Bug 13 - Meeko, Skittish Scrounger",
  description:
    "Two copies of Meeko exerted in play; opponent has a single card on top of their deck to be discarded when the ability triggers.",
  playerOne: {
    play: [
      { card: meekoSkittishScrounger, exerted: true },
      { card: meekoSkittishScrounger, exerted: true },
    ],
    hand: [madamMimSnake],
    inkwell: 6,
    deck: [heiheiBoatSnack, heiheiBoatSnack, heiheiBoatSnack],
  },
  playerTwo: {
    deck: [peteBadGuy, belleStrangeButSpecial, heiheiBoatSnack],
    hand: [peteBadGuy],
  },
  seed: "bug-13-meeko-skittish-scrounger",
  skipPreGame: true,
});
