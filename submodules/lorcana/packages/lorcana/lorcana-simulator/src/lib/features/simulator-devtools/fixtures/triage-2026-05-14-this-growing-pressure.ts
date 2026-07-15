import { chiefTuiRespectedLeader, mickeyMouseTrueFriend } from "@tcg/lorcana-cards/cards/001";
import { thisGrowingPressure } from "@tcg/lorcana-cards/cards/012";
import { createFixture } from "./fixture-factory";

export const triage20260514ThisGrowingPressureFixture = createFixture({
  id: "triage-2026-05-14-this-growing-pressure",
  name: "Triage 2026-05-14 - This Growing Pressure forced quest",
  description:
    "Visual repro for This Growing Pressure bug. P1 plays This Growing Pressure, choosing P2's Chief Tui. On P2's next turn, Chief Tui should be forced to quest if able and unable to challenge. Switch to P2 and verify Chief Tui has a quest obligation and cannot challenge.",
  skipPreGame: true,
  playerOne: {
    inkwell: 5,
    hand: [thisGrowingPressure],
    play: [],
    deck: 10,
    lore: 0,
  },
  playerTwo: {
    hand: [],
    play: [
      { card: chiefTuiRespectedLeader, isDrying: false },
      { card: mickeyMouseTrueFriend, isDrying: false },
    ],
    deck: 10,
    lore: 0,
  },
  seed: "triage-2026-05-14-this-growing-pressure",
});
