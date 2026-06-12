import {
  mickeyMouseArtfulRogue,
  mickeyMouseDetective,
  moanaChosenByTheOcean,
  simbaProtectiveCub,
} from "@tcg/lorcana-cards/cards/001";
import { beyondTheHorizon } from "@tcg/lorcana-cards/cards/008";
import { createFixture } from "./fixture-factory";

export const triage20260518BeyondTheHorizonEmptyHandFixture = createFixture({
  id: "triage-2026-05-18-beyond-the-horizon-empty-hand",
  name: "Triage 2026-05-18 - Beyond the Horizon empty hand draw",
  description:
    "Visual validation for the Beyond the Horizon Sing Together report. P1 has only Beyond the Horizon in hand, two ready singers with total cost 8, and 3 known cards in deck. Use Sing Together, choose the self-only option, and confirm P1 draws 3 cards even though their hand is empty after the song is played.",
  skipPreGame: true,
  playerOne: {
    inkwell: 0,
    hand: [beyondTheHorizon],
    play: [
      { card: moanaChosenByTheOcean, isDrying: false },
      { card: mickeyMouseDetective, isDrying: false },
    ],
    deck: [mickeyMouseArtfulRogue, mickeyMouseDetective, simbaProtectiveCub],
    lore: 0,
  },
  playerTwo: {
    hand: [],
    play: [],
    deck: 10,
    lore: 0,
  },
  seed: "triage-2026-05-18-beyond-the-horizon-empty-hand",
});
