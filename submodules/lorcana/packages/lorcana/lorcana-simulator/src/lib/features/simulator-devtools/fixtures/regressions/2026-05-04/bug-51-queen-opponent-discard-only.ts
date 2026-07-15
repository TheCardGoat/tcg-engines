import { theQueenJealousBeauty } from "@tcg/lorcana-cards/cards/007";
import {
  heiheiBoatSnack,
  belleStrangeButSpecial,
  chiefTuiRespectedLeader,
  moanaOfMotunui,
} from "@tcg/lorcana-cards/cards/001";
import { peteBadGuy } from "@tcg/lorcana-cards/cards/002";
import { befuddle } from "@tcg/lorcana-cards/cards/001";
import { createFixture } from "../../fixture-factory.js";

export const bug51QueenOpponentDiscardOnly = createFixture({
  id: "bug-51-queen-opponent-discard-only",
  name: "Bug 51 - The Queen Opponent Discard Only",
  description:
    "The Queen - Jealous Beauty's NO ORDINARY APPLE activated ability targets cards from chosen opponent's discard (selector owner: 'opponent') and puts them on the bottom of their deck for lore. The bug: the picker also offers cards from YOUR OWN discard, ignoring the opponent owner constraint. Setup: The Queen is ready in P1's play. Both players have distinguishable cards in their discard so it is easy to spot if friendly cards leak into the picker. Sequence: activate The Queen's ability (exert), then look at the put-on-bottom picker. Bug: P1's own discard cards (Belle, Heihei, Befuddle) appear as valid targets. Correct: only P2's discard cards (Pete, Moana, Chief Tui) are selectable.",
  playerOne: {
    play: [theQueenJealousBeauty],
    hand: [],
    discard: [belleStrangeButSpecial, heiheiBoatSnack, befuddle],
    inkwell: 4,
    deck: 10,
    lore: 0,
  },
  playerTwo: {
    play: [],
    discard: [peteBadGuy, moanaOfMotunui, chiefTuiRespectedLeader],
    deck: 10,
    lore: 0,
  },
  seed: "bug-51-queen-opponent-discard-only",
  skipPreGame: true,
});
