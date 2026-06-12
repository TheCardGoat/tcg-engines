import { donaldDuckFredHoneywell } from "@tcg/lorcana-cards/cards/011";
import { omnidroidV10 } from "@tcg/lorcana-cards/cards/012";
import { peteBadGuy } from "@tcg/lorcana-cards/cards/002";
import { heiheiBoatSnack } from "@tcg/lorcana-cards/cards/001";
import { createFixture } from "../../fixture-factory.js";

export const bug69DonaldFredHoneywellDoubleTrigger = createFixture({
  id: "bug-69-donald-fred-honeywell-double-trigger",
  name: "Bug 69 - Donald Fred Honeywell double WELL WISHES trigger",
  description:
    "P1 has two copies of Donald Duck - Fred Honeywell in play (ready, not drying) and Omnidroid V.10 with two cards stacked beneath it (simulating prior Boost activations). P2 has a ready Pete who can challenge into Omnidroid on P2's turn to banish it. When Omnidroid is banished, both Donalds should independently observe the banishment of a character with cards under it and each fire WELL WISHES. Bug: with 2 Donalds in play, only one (or neither) WELL WISHES triggers — the trigger is deduped or dropped. Correct behavior: BOTH Donalds trigger WELL WISHES.",
  playerOne: {
    play: [
      { card: donaldDuckFredHoneywell, isDrying: false },
      { card: donaldDuckFredHoneywell, isDrying: false },
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
    play: [{ card: peteBadGuy, isDrying: false }],
    deck: 10,
    lore: 0,
  },
  seed: "bug-69-donald-fred-honeywell-double-trigger",
  skipPreGame: true,
});
