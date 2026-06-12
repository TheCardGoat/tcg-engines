import { heiheiExpandedConsciousness } from "@tcg/lorcana-cards/cards/007";
import {
  alanadaleLoyalBard,
  daleExcitedFriend,
  hammPiggyBank,
  omnidroidV8,
  omnidroidV9,
} from "@tcg/lorcana-cards/cards/012";
import { createFixture } from "../../fixture-factory.js";

export const bug64HeiheiExpandedClearYourMind = createFixture({
  id: "bug-64-heihei-expanded-clear-your-mind",
  name: "Bug 64 - Heihei Expanded Consciousness CLEAR YOUR MIND does not ink full hand",
  description:
    "Heihei - Expanded Consciousness (cost 5) has CLEAR YOUR MIND: 'When you play this character, put all cards from your hand into your inkwell facedown and exerted.' Setup: P1 has Heihei in hand alongside 5 mixed cards (Hamm Piggy Bank, Alan-A-Dale Loyal Bard, Dale Excited Friend, Omnidroid v8, Omnidroid v9), plus 5 ink to pay Heihei's cost. Play Heihei. Bug: CLEAR YOUR MIND only inks a subset (or zero) of the remaining hand cards instead of all of them. Correct behavior: after Heihei resolves, P1's hand is empty and all five sibling cards are in the inkwell facedown and exerted.",
  playerOne: {
    play: [],
    hand: [
      heiheiExpandedConsciousness,
      hammPiggyBank,
      alanadaleLoyalBard,
      daleExcitedFriend,
      omnidroidV8,
      omnidroidV9,
    ],
    inkwell: 5,
    deck: 10,
    lore: 0,
  },
  playerTwo: {
    play: [],
    deck: 10,
    lore: 0,
  },
  seed: "bug-64-heihei-expanded-clear-your-mind",
  skipPreGame: true,
});
