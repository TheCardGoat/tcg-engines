import {
  heiheiBoatSnack,
  letItGo,
  aWholeNewWorld,
  grabYourSword,
  reflection,
  friendsOnTheOtherSide,
  hakunaMatata,
} from "@tcg/lorcana-cards/cards/001";
import { peteBadGuy } from "@tcg/lorcana-cards/cards/002";
import { maxGoofChartTopper } from "@tcg/lorcana-cards/cards/009";
import { createFixture } from "../../fixture-factory.js";

export const bug19MaxGoofChartTopper = createFixture({
  id: "bug-19-max-goof-chart-topper",
  name: "Bug 19 - Max Goof, Chart Topper",
  description:
    "Max Goof in play with multiple songs of varying costs in discard. Ready to quest so QA can trigger any quest-related ability.",
  playerOne: {
    play: [maxGoofChartTopper],
    hand: [heiheiBoatSnack],
    inkwell: 6,
    deck: [heiheiBoatSnack, heiheiBoatSnack, heiheiBoatSnack],
    discard: [reflection, aWholeNewWorld, friendsOnTheOtherSide, hakunaMatata],
  },
  playerTwo: {
    play: [peteBadGuy],
    deck: [peteBadGuy, peteBadGuy, peteBadGuy],
  },
  seed: "bug-19-max-goof-chart-topper",
  skipPreGame: true,
});
