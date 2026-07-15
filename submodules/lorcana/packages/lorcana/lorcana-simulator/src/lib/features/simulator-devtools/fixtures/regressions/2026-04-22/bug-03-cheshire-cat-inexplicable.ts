import { cheshireCatInexplicable } from "@tcg/lorcana-cards/cards/010";
import { peteBadGuy } from "@tcg/lorcana-cards/cards/002";
import {
  chiefTuiRespectedLeader,
  heiheiBoatSnack,
  belleStrangeButSpecial,
} from "@tcg/lorcana-cards/cards/001";
import { createFixture } from "../../fixture-factory.js";

export const bug03CheshireCatInexplicable = createFixture({
  id: "bug-03-cheshire-cat-inexplicable",
  name: "Bug 03 - Cheshire Cat Inexplicable",
  description:
    "Cheshire Cat - Inexplicable in play with Boost 2. One scenario: your own characters have no damage counters (trigger should still offer to move up to 2 but from a valid target). Second scenario: a friendly character has damage counters to move onto an opposing character. Extra card in hand lets QA put a card under Cheshire to fire the trigger.",
  playerOne: {
    play: [
      cheshireCatInexplicable,
      { card: belleStrangeButSpecial, damage: 2 },
      { card: heiheiBoatSnack, damage: 0 },
    ],
    hand: [heiheiBoatSnack],
    inkwell: 5,
    deck: 10,
  },
  playerTwo: {
    play: [peteBadGuy, chiefTuiRespectedLeader],
    deck: 10,
  },
  seed: "bug-03-cheshire-cat-inexplicable",
  skipPreGame: true,
});
