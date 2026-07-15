import { mickeyMouseTrueFriend } from "@tcg/lorcana-cards/cards/001";
import {
  bibbidiBobbidiBoo,
  cheshireCatAlwaysGrinning,
  flynnRiderConfidentVagabond,
} from "@tcg/lorcana-cards/cards/002";
import { createFixture } from "./fixture-factory";

export const triage20260514BibbidiBobbidiBooFixture = createFixture({
  id: "triage-2026-05-14-bibbidi-bobbidi-boo",
  name: "Triage 2026-05-14 - Bibbidi Bobbidi Boo excludes returned card",
  description:
    "Visual repro for digest report #7. Cast Bibbidi Bobbidi Boo and return Flynn Rider - Confident Vagabond from play. Expected: the follow-up free-play picker offers only another valid character from hand, such as Cheshire Cat, and must not offer the same returned Flynn card as a no-op candidate.",
  skipPreGame: true,
  playerOne: {
    inkwell: bibbidiBobbidiBoo.cost,
    hand: [bibbidiBobbidiBoo, cheshireCatAlwaysGrinning, mickeyMouseTrueFriend],
    play: [{ card: flynnRiderConfidentVagabond, isDrying: false }],
    deck: 10,
    lore: 0,
  },
  playerTwo: {
    hand: [],
    play: [],
    deck: 10,
    lore: 0,
  },
  seed: "triage-2026-05-14-bibbidi-bobbidi-boo",
});
