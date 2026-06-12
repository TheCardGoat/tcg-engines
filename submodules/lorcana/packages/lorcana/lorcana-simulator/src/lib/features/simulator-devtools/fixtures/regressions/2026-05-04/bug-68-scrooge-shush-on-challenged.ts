import { scroogeMcduckShushAgent } from "@tcg/lorcana-cards/cards/010";
import { peteBadGuy } from "@tcg/lorcana-cards/cards/002";
import { createFixture } from "../../fixture-factory.js";

export const bug68ScroogeShushOnChallenged = createFixture({
  id: "bug-68-scrooge-shush-on-challenged",
  name: "Bug 68 - Scrooge Shush ON THE MOVE on challenged",
  description:
    "P1 has Scrooge McDuck - Shush Agent in play, exerted (so he can be challenged). P2 has a ready Pete with strength sufficient to lethally damage Scrooge. On P2's turn, challenge Scrooge with Pete. Bug: ON THE MOVE return-to-hand triggers on the challenged event, but challenge damage resolves first and banishes Scrooge before the trigger returns him. Correct behavior: Scrooge returns to P1's hand instead of being banished, and no damage is dealt to him.",
  playerOne: {
    play: [{ card: scroogeMcduckShushAgent, exerted: true, isDrying: false }],
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
  seed: "bug-68-scrooge-shush-on-challenged",
  skipPreGame: true,
});
