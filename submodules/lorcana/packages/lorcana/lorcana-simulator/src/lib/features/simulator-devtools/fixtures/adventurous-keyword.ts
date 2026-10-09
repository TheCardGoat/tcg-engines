import { mickeyMouseBestInTown } from "@tcg/lorcana-cards/cards/014";
import { goofyMusketeer } from "./fixture-cards.js";
import { createFixture } from "./fixture-factory";

export const adventurousKeywordFixture = createFixture({
  id: "adventurous-keyword",
  name: "Adventurous Keyword Badge",
  description:
    "Visual validation for the set 14 Adventurous badge. Mickey Mouse - Best in Town is printed with Adventurous (can't challenge and must quest if able): the board tag should read Adventurous with the full keyword tooltip instead of the generic Can't Challenge badge. Goofy Musketeer is the unbadged contrast.",
  skipPreGame: true,
  playerOne: {
    inkwell: 5,
    hand: [],
    play: [
      { card: mickeyMouseBestInTown, isDrying: false },
      { card: goofyMusketeer, isDrying: false },
    ],
    deck: 10,
    lore: 0,
  },
  playerTwo: {
    hand: [],
    play: [],
    deck: 10,
    lore: 0,
  },
  seed: "adventurous-keyword-badge",
});
