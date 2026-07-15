import { shereKhanFearsomeTiger } from "@tcg/lorcana-cards/cards/010";
import { annaHeirToArendelle } from "@tcg/lorcana-cards/cards/001";
import { createFixture } from "./fixture-factory";

export const triage20260508ShereKhanSkipOptionalFixture = createFixture({
  id: "triage-2026-05-08-shere-khan-skip-optional",
  name: "Triage 2026-05-08 — Shere Khan ON THE HUNT skip optional",
  description:
    "Player report: 'Shere Khan - Fearsome Tiger ON THE HUNT requires a target for the optional 1-damage step. With no opposing characters left after the banish, the player is forced to damage their own.' Repro: P1 quests Shere Khan (ready). P2 has a single damaged Anna (1 damage). Banish step targets Anna → opponent has no characters left. The optional 'put 1 damage on another chosen character' step should offer a Skip / Cancel button so the controller is not forced to damage themselves.",
  skipPreGame: true,
  playerOne: {
    inkwell: 6,
    hand: [],
    play: [{ card: shereKhanFearsomeTiger, isDrying: false }],
    deck: 5,
  },
  playerTwo: {
    inkwell: 6,
    hand: [],
    play: [{ card: annaHeirToArendelle, isDrying: false, damage: 1 }],
    deck: 5,
  },
});
