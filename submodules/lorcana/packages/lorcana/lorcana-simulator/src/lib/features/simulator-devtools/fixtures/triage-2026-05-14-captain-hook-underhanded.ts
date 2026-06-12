import { mickeyMouseTrueFriend } from "@tcg/lorcana-cards/cards/001";
import {
  captainHookUnderhanded,
  minnieMousePirateLookout,
  rooLittlestPirate,
} from "@tcg/lorcana-cards/cards/006";
import { createFixture } from "./fixture-factory";

export const triage20260514CaptainHookUnderhandedFixture = createFixture({
  id: "triage-2026-05-14-captain-hook-underhanded",
  name: "Triage 2026-05-14 - Captain Hook Underhanded quest restriction",
  description:
    "Visual repro for digest reports #8/#19. P1's Captain Hook - Underhanded is exerted. Switch to player two in the harness: opposing Pirate characters Roo and Minnie should show no quest action while Hook is exerted, while non-Pirate Mickey Mouse should still be able to quest. Hook himself should not be restricted by his own static effect.",
  skipPreGame: true,
  playerOne: {
    hand: [],
    play: [{ card: captainHookUnderhanded, isDrying: false, exerted: true }],
    deck: 10,
    lore: 0,
  },
  playerTwo: {
    hand: [],
    play: [
      { card: rooLittlestPirate, isDrying: false },
      { card: minnieMousePirateLookout, isDrying: false },
      { card: mickeyMouseTrueFriend, isDrying: false },
    ],
    deck: 10,
    lore: 0,
  },
  seed: "triage-2026-05-14-captain-hook-underhanded",
});
