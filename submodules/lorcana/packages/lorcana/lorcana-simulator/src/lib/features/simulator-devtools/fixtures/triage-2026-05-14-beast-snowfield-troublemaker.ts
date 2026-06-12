import { mickeyMouseTrueFriend } from "@tcg/lorcana-cards/cards/001";
import { beastSnowfieldTroublemaker } from "@tcg/lorcana-cards/cards/011";
import { createFixture } from "./fixture-factory";

export const triage20260514BeastSnowfieldTroublemakerFixture = createFixture({
  id: "triage-2026-05-14-beast-snowfield-troublemaker",
  name: "Triage 2026-05-14 - Beast Snowfield Troublemaker Rush bug",
  description:
    "Visual repro for Beast - Snowfield Troublemaker Rush bug. Play Beast from P1's hand — it has Rush and should be able to challenge P2's character immediately.",
  skipPreGame: true,
  playerOne: {
    inkwell: 2,
    hand: [beastSnowfieldTroublemaker],
    play: [],
    deck: 10,
    lore: 0,
  },
  playerTwo: {
    hand: [],
    play: [{ card: mickeyMouseTrueFriend, isDrying: false, exerted: true }],
    deck: 10,
    lore: 0,
  },
  seed: "triage-2026-05-14-beast-snowfield-troublemaker",
});
