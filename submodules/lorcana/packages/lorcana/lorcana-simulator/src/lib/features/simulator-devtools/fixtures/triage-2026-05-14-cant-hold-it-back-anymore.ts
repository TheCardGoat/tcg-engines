import { chiefTuiRespectedLeader, mickeyMouseTrueFriend } from "@tcg/lorcana-cards/cards/001";
import { cantHoldItBackAnymore } from "@tcg/lorcana-cards/cards/010";
import { createFixture } from "./fixture-factory";

export const triage20260514CantHoldItBackAnymoreFixture = createFixture({
  id: "triage-2026-05-14-cant-hold-it-back-anymore",
  name: "Triage 2026-05-14 - Can't Hold It Back Anymore damage transfer",
  description:
    "Visual repro for Can't Hold It Back Anymore bug. P1 plays the song. Choose P2's Chief Tui — the chosen character should become exerted and receive all damage counters from all other characters.",
  skipPreGame: true,
  playerOne: {
    inkwell: 5,
    hand: [cantHoldItBackAnymore],
    play: [
      { card: chiefTuiRespectedLeader, isDrying: false, damage: 2 },
      { card: mickeyMouseTrueFriend, isDrying: false, damage: 1 },
    ],
    deck: 10,
    lore: 0,
  },
  playerTwo: {
    hand: [],
    play: [{ card: chiefTuiRespectedLeader, isDrying: false }],
    deck: 10,
    lore: 0,
  },
  seed: "triage-2026-05-14-cant-hold-it-back-anymore",
});
