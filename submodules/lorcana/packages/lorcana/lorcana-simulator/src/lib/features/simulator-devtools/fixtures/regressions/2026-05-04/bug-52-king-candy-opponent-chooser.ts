import { kingCandyRoyalRacer } from "@tcg/lorcana-cards/cards/007";
import { candleheadDedicatedRacer } from "@tcg/lorcana-cards/cards/007";
import { peteBadGuy } from "@tcg/lorcana-cards/cards/002";
import { chiefTuiRespectedLeader, heiheiBoatSnack } from "@tcg/lorcana-cards/cards/001";
import { smash } from "@tcg/lorcana-cards/cards/001";
import { createFixture } from "../../fixture-factory.js";

export const bug52KingCandyOpponentChooser = createFixture({
  id: "bug-52-king-candy-opponent-chooser",
  name: "Bug 52 - King Candy Opponent Chooser",
  description:
    "King Candy - Royal Racer's SWEET REVENGE triggers whenever one of your OTHER Racer characters is banished — each opponent then optionally banishes one of THEIR OWN characters (the optional has chooser: 'OPPONENT'). Bug: the resulting prompt is being shown to the active/triggering player (P1) instead of the opponent (P2). Setup: P1 has King Candy and Candlehead (a Racer, low willpower) in play. P1 also has Smash in hand to deal lethal damage to Candlehead and fire the trigger. P2 has Pete, Chief Tui, and Heihei in play as candidates the OPPONENT (P2) should be allowed to choose from. Sequence: play Smash on Candlehead (or otherwise banish Candlehead) to fire SWEET REVENGE, then verify whose seat the chooser appears in. Bug: P1 sees the picker and would be picking from P2's characters (controller-driven). Correct: P2 sees the picker and chooses one of their own to banish.",
  playerOne: {
    play: [kingCandyRoyalRacer, candleheadDedicatedRacer],
    hand: [smash],
    inkwell: 4,
    deck: 10,
    lore: 0,
  },
  playerTwo: {
    play: [peteBadGuy, chiefTuiRespectedLeader, heiheiBoatSnack],
    deck: 10,
    lore: 0,
  },
  seed: "bug-52-king-candy-opponent-chooser",
  skipPreGame: true,
});
