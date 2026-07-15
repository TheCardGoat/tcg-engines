import { chiefTuiRespectedLeader } from "@tcg/lorcana-cards/cards/001";
import { mrIncredibleBobParr, mrIncredibleSuperStrong } from "@tcg/lorcana-cards/cards/012";
import { createFixture } from "./fixture-factory";

export const triage20260514MrIncredibleSuperStrongFixture = createFixture({
  id: "triage-2026-05-14-mr-incredible-super-strong",
  name: "Triage 2026-05-14 - Mr. Incredible Super Strong LET'S DO THIS!",
  description:
    "Visual repro for Mr. Incredible - Super Strong LET'S DO THIS! bug. P1 has Mr. Incredible (Super Strong) in play. Have another Super character (Bob Parr) challenge P2 — Mr. Incredible's ability should trigger and draw a card.",
  skipPreGame: true,
  playerOne: {
    inkwell: 2,
    hand: [],
    play: [
      { card: mrIncredibleSuperStrong, isDrying: false },
      { card: mrIncredibleBobParr, isDrying: false },
    ],
    deck: 10,
    lore: 0,
  },
  playerTwo: {
    hand: [],
    play: [{ card: chiefTuiRespectedLeader, isDrying: false, exerted: true }],
    deck: 10,
    lore: 0,
  },
  seed: "triage-2026-05-14-mr-incredible-super-strong",
});
