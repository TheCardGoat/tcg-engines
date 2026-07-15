import { chiefTuiRespectedLeader, mickeyMouseTrueFriend } from "@tcg/lorcana-cards/cards/001";
import { theSwordOfShanyu } from "@tcg/lorcana-cards/cards/008";
import { createFixture } from "./fixture-factory";

export const triage20260514SwordOfShanyuFixture = createFixture({
  id: "triage-2026-05-14-sword-of-shan-yu",
  name: "Triage 2026-05-14 - Sword of Shan Yu item ability",
  description:
    "Visual repro for Sword of Shan Yu item bug. P1 has Sword in play and an exerted character. Activate the Sword by exerting a character — it should ready the chosen character.",
  skipPreGame: true,
  playerOne: {
    inkwell: 0,
    hand: [],
    play: [
      { card: theSwordOfShanyu, isDrying: false },
      { card: chiefTuiRespectedLeader, isDrying: false, exerted: true },
      { card: mickeyMouseTrueFriend, isDrying: false },
    ],
    deck: 10,
    lore: 0,
  },
  playerTwo: {
    hand: [],
    play: [{ card: mickeyMouseTrueFriend, isDrying: false }],
    deck: 10,
    lore: 0,
  },
  seed: "triage-2026-05-14-sword-of-shan-yu",
});
