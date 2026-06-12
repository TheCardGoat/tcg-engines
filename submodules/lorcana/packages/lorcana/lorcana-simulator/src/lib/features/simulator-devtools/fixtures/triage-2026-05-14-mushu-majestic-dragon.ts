import { chiefTuiRespectedLeader, mickeyMouseTrueFriend } from "@tcg/lorcana-cards/cards/001";
import { mushuMajesticDragon } from "@tcg/lorcana-cards/cards/007";
import { createFixture } from "./fixture-factory";

export const triage20260514MushuMajesticDragonFixture = createFixture({
  id: "triage-2026-05-14-mushu-majestic-dragon",
  name: "Triage 2026-05-14 - Mushu Majestic Dragon Resist stacking",
  description:
    "Visual repro for Mushu Majestic Dragon report. P1's characters should each gain Resist +2 ONLY during their challenge — not stacking across multiple challenges. Challenge P2's first character and note the resist; it should reset after the challenge resolves.",
  skipPreGame: true,
  playerOne: {
    inkwell: 2,
    hand: [],
    play: [
      { card: mushuMajesticDragon, isDrying: false },
      { card: chiefTuiRespectedLeader, isDrying: false },
      { card: chiefTuiRespectedLeader, isDrying: false },
    ],
    deck: 10,
    lore: 0,
  },
  playerTwo: {
    hand: [],
    play: [
      { card: mickeyMouseTrueFriend, isDrying: false, exerted: true },
      { card: mickeyMouseTrueFriend, isDrying: false },
    ],
    deck: 10,
    lore: 0,
  },
  seed: "triage-2026-05-14-mushu-majestic-dragon",
});
