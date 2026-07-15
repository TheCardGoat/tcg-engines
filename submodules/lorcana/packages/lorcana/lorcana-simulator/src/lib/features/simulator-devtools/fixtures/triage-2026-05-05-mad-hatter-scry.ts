import { madHatterEccentricHost } from "@tcg/lorcana-cards/cards/006";
import { createFixture } from "./fixture-factory";

export const triage20260505MadHatterScryFixture = createFixture({
  id: "triage-2026-05-05-mad-hatter-scry",
  name: "Triage 2026-05-05 — Mad Hatter Eccentric Host (1 report)",
  description:
    "Player report: 'effect is not resolving. It should allow you to look at the top of either player's deck and then discard or keep the card there'. Repro: quest Mad Hatter, accept the trigger, choose either player, then put their top card on top of their deck OR into their discard.",
  skipPreGame: true,
  playerOne: {
    inkwell: 1,
    hand: [],
    play: [{ card: madHatterEccentricHost, isDrying: false }],
    deck: 8,
  },
  playerTwo: {
    inkwell: 5,
    hand: [],
    play: [],
    deck: 8,
  },
});
