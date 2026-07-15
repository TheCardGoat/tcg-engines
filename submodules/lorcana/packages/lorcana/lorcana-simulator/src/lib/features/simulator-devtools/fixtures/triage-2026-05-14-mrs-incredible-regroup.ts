import { chiefTuiRespectedLeader, mickeyMouseTrueFriend } from "@tcg/lorcana-cards/cards/001";
import { mrIncredibleBobParr, mrsIncredibleDeterminedRescuer } from "@tcg/lorcana-cards/cards/012";
import { createFixture } from "./fixture-factory";

export const triage20260514MrsIncredibleRegroupFixture = createFixture({
  id: "triage-2026-05-14-mrs-incredible-regroup",
  name: "Triage 2026-05-14 - Mrs. Incredible Determined Rescuer REGROUP",
  description:
    "Visual repro for Mrs. Incredible - Determined Rescuer REGROUP bug. P1 challenges and banishes one of P2's characters — the REGROUP ability should trigger and offer to ready a chosen Super character.",
  skipPreGame: true,
  playerOne: {
    inkwell: 2,
    hand: [],
    play: [
      { card: mrsIncredibleDeterminedRescuer, isDrying: false },
      { card: mrIncredibleBobParr, isDrying: false, exerted: true },
    ],
    deck: 10,
    lore: 0,
  },
  playerTwo: {
    hand: [],
    play: [
      { card: chiefTuiRespectedLeader, isDrying: false, exerted: true },
      { card: mickeyMouseTrueFriend, isDrying: false, exerted: true },
    ],
    deck: 10,
    lore: 0,
  },
  seed: "triage-2026-05-14-mrs-incredible-regroup",
});
