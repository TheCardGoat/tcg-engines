import {
  alanadaleLoyalBard,
  daleExcitedFriend,
  hammPiggyBank,
  omnidroidV8,
  omnidroidV9,
  syndromeOutForRevenge,
} from "@tcg/lorcana-cards/cards/012";
import { createFixture } from "../../fixture-factory.js";

export const bug61SyndromeOutForRevengeRobotFilter = createFixture({
  id: "bug-61-syndrome-out-for-revenge-robot-filter",
  name: "Bug 61 - Syndrome Out for Revenge Robot filter not enforced",
  description:
    "Syndrome - Out for Revenge has GOT ME MONOLOGUING!: whenever he quests, return a Robot character card from discard to hand, then optionally play or shift a Robot character with cost 8 or less for free. P1 has Syndrome ready (not drying) so he can quest immediately. P1's discard contains 2 Robots (Omnidroid v8 x2) and 2 non-Robots (Alan-A-Dale, Dale Excited Friend). P1's hand contains 1 Robot (Omnidroid v9) and 1 non-Robot Toy (Hamm Piggy Bank). Quest with Syndrome and verify (a) the return-from-discard picker only offers the two Omnidroid v8 copies and (b) the optional play-from-hand step only offers Omnidroid v9, not Hamm. Bug: the has-classification 'Robot' filter is not enforced on either step, so non-Robots appear in both pickers.",
  playerOne: {
    play: [{ card: syndromeOutForRevenge, isDrying: false }],
    hand: [omnidroidV9, hammPiggyBank],
    discard: [omnidroidV8, omnidroidV8, alanadaleLoyalBard, daleExcitedFriend],
    inkwell: 8,
    deck: 10,
    lore: 0,
  },
  playerTwo: {
    play: [],
    deck: 10,
    lore: 0,
  },
  seed: "bug-61-syndrome-out-for-revenge-robot-filter",
  skipPreGame: true,
});
