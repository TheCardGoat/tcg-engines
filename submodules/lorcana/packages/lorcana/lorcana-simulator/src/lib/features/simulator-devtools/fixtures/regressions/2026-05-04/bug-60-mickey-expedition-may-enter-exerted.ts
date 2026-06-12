import { mickeyMouseExpeditionLeader } from "@tcg/lorcana-cards/cards/012";
import { createFixture } from "../../fixture-factory.js";

export const bug60MickeyExpeditionMayEnterExerted = createFixture({
  id: "bug-60-mickey-expedition-may-enter-exerted",
  name: "Bug 60 - Mickey Expedition Leader may-enter-play-exerted toggle missing",
  description:
    "Mickey Mouse - Expedition Leader (cost 4) has LONG JOURNEY: 'This character may enter play exerted.' P1 has Mickey in hand and 4 ink available to play him. Bug: when Mickey is played from hand, the optional 'enter play exerted' toggle is never surfaced to the player, so the SECRET PATH interaction (which only fires while Mickey is exerted) cannot be set up at play time. Correct behavior: after paying Mickey's cost, the player is prompted to choose whether he enters play exerted.",
  playerOne: {
    play: [],
    hand: [mickeyMouseExpeditionLeader],
    inkwell: 4,
    deck: 10,
    lore: 0,
  },
  playerTwo: {
    play: [],
    deck: 10,
    lore: 0,
  },
  seed: "bug-60-mickey-expedition-may-enter-exerted",
  skipPreGame: true,
});
