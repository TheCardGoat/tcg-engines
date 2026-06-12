import { heiheiPersistentPresence } from "@tcg/lorcana-cards/cards/002";
import { theHornedKingTriumphantGhoul } from "@tcg/lorcana-cards/cards/010";
import { peteBadGuy } from "@tcg/lorcana-cards/cards/002";
import { createFixture } from "../../fixture-factory.js";

export const bug53HeiheiHornedKingDiscardMetric = createFixture({
  id: "bug-53-heihei-horned-king-discard-metric",
  name: "Bug 53 - HeiHei + Horned King discard metric",
  description:
    "On P1's turn, challenge P2's exerted Pete with HeiHei. Pete banishes HeiHei, then HE'S BACK! returns HeiHei from discard to hand. Verify The Horned King immediately shows +2 {L} on the same turn (GRAND MACHINATIONS triggers because a card left a player's discard). Bug: HE'S BACK!'s return-from-discard does not increment the discard-cards-left turn metric, so Horned King keeps his base 1 {L}. Correct behavior: Horned King displays 3 {L} for the rest of P1's turn.",
  playerOne: {
    play: [theHornedKingTriumphantGhoul, { card: heiheiPersistentPresence, isDrying: false }],
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
  seed: "bug-53-heihei-horned-king-discard-metric",
  skipPreGame: true,
});
