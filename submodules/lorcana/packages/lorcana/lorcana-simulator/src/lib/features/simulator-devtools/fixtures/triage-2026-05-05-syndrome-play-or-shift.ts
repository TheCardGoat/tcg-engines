import {
  omnidroidV8,
  omnidroidV9,
  omnidroidV10,
  syndromeOutForRevenge,
} from "@tcg/lorcana-cards/cards/012";
import { createFixture } from "./fixture-factory";

export const triage20260505SyndromePlayOrShiftFixture = createFixture({
  id: "triage-2026-05-05-syndrome-play-or-shift",
  name: "Triage 2026-05-05 — Syndrome Out for Revenge play-or-shift (1 report)",
  description:
    "Player report: 'I should be able to shift out a robot char with Syndrome's quest ability, but it plays out on its own instead of allowing me the shift opportunity.' Repro: quest Syndrome, return Omnidroid v9 from discard to hand, then on the optional 'play or shift a Robot' choice — verify the player is offered a CHOICE between playing the Omnidroid normally or shifting it onto Omnidroid v8 in play.",
  skipPreGame: true,
  playerOne: {
    inkwell: 0,
    hand: [omnidroidV10],
    play: [
      { card: syndromeOutForRevenge, isDrying: false },
      { card: omnidroidV8, isDrying: false },
    ],
    discard: [omnidroidV9],
    deck: 5,
  },
  playerTwo: {
    inkwell: 5,
    hand: [],
    play: [],
    deck: 5,
  },
});
