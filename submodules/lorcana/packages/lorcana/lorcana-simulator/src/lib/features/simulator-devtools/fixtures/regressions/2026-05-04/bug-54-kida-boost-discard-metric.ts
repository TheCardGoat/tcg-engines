import { kidaDiscoveringTheUnknown, omnidroidV10 } from "@tcg/lorcana-cards/cards/012";
import { peteBadGuy } from "@tcg/lorcana-cards/cards/002";
import { heiheiBoatSnack } from "@tcg/lorcana-cards/cards/001";
import { createFixture } from "../../fixture-factory.js";

export const bug54KidaBoostDiscardMetric = createFixture({
  id: "bug-54-kida-boost-discard-metric",
  name: "Bug 54 - Kida + Boost-host cards-under discard metric",
  description:
    "P1 has Kida (ready to quest, not drying) and Omnidroid V.10 in play with two cards stacked beneath it (simulating prior Shift/Boost activations). On P1's turn, banish Omnidroid (e.g. challenge into P2's Pete). Omnidroid + its two cards-under all move to P1's discard — that's three cards entering discard this turn. Then quest with Kida and watch READ THE RUNES (requires 2+ cards put into your discard this turn). Bug: cards-under that follow their host into discard are not counted by the discard-cards-entered metric, so Kida never offers the inkwell prompt. Correct behavior: the optional 'put top of deck into inkwell' prompt appears.",
  playerOne: {
    play: [
      { card: kidaDiscoveringTheUnknown, isDrying: false },
      {
        card: omnidroidV10,
        isDrying: false,
        cardsUnder: [heiheiBoatSnack, heiheiBoatSnack],
      },
    ],
    hand: [],
    inkwell: 5,
    deck: 10,
    lore: 0,
  },
  playerTwo: {
    play: [{ card: peteBadGuy, exerted: true }],
    deck: 10,
    lore: 0,
  },
  seed: "bug-54-kida-boost-discard-metric",
  skipPreGame: true,
});
