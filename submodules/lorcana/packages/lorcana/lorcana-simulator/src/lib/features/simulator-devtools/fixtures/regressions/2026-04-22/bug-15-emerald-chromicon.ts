import { belleStrangeButSpecial, heiheiBoatSnack } from "@tcg/lorcana-cards/cards/001";
import { peteBadGuy, peteBadGuyEnchanted } from "@tcg/lorcana-cards/cards/002";
import { chiefTuiProudOfMotunui } from "@tcg/lorcana-cards/cards/003";
import { emeraldChromicon } from "@tcg/lorcana-cards/cards/005";
import { createFixture } from "../../fixture-factory.js";
import { peteBornToCheat } from "@tcg/lorcana-cards/cards/004";

export const bug15EmeraldChromicon = createFixture({
  id: "bug-15-emerald-chromicon",
  name: "Bug 15 - Emerald Chromicon",
  description:
    "Emerald Chromicon in play with multiple damaged friendly characters and opposing characters. Intended to be observed on opponent's turn so triggers fire and potential chained banish is visible.",
  playerOne: {
    play: [
      emeraldChromicon,
      { card: belleStrangeButSpecial, damage: 2 },
      { card: chiefTuiProudOfMotunui, damage: 1 },
    ],
    hand: [heiheiBoatSnack],
    inkwell: 5,
    deck: [heiheiBoatSnack, heiheiBoatSnack],
  },
  playerTwo: {
    play: [peteBadGuy, peteBadGuyEnchanted, peteBornToCheat],
    hand: [peteBadGuy],
    inkwell: 5,
    deck: [peteBadGuy, peteBadGuy, peteBadGuy],
  },
  seed: "bug-15-emerald-chromicon",
  skipPreGame: true,
});
