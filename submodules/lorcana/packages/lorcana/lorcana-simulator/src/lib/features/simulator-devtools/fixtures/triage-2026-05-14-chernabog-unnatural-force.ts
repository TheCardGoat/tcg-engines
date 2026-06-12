import { chiefTuiRespectedLeader, mickeyMouseTrueFriend } from "@tcg/lorcana-cards/cards/001";
import { chernabogUnnaturalForce } from "@tcg/lorcana-cards/cards/011";
import { createFixture } from "./fixture-factory";

export const triage20260514ChernabogUnnaturalForceFixture = createFixture({
  id: "triage-2026-05-14-chernabog-unnatural-force",
  name: "Triage 2026-05-14 - Chernabog Unnatural Force DARK DANCE",
  description:
    "Visual repro for Chernabog - Unnatural Force DARK DANCE. Play Chernabog. The engine should let P1 choose an opposing character to shuffle into their deck; then P2 should get the option to play a character from discard for free.",
  skipPreGame: true,
  playerOne: {
    inkwell: 9,
    hand: [chernabogUnnaturalForce],
    play: [],
    deck: 10,
    lore: 0,
  },
  playerTwo: {
    hand: [],
    play: [{ card: mickeyMouseTrueFriend, isDrying: false }],
    discard: [chiefTuiRespectedLeader],
    deck: 10,
    lore: 0,
  },
  seed: "triage-2026-05-14-chernabog-unnatural-force",
});
