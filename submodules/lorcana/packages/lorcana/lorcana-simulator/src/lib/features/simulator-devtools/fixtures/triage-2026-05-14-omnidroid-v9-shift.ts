import { chiefTuiRespectedLeader } from "@tcg/lorcana-cards/cards/001";
import { omnidroidV8, omnidroidV9 } from "@tcg/lorcana-cards/cards/012";
import { createFixture } from "./fixture-factory";

export const triage20260514OmnidroidV9ShiftFixture = createFixture({
  id: "triage-2026-05-14-omnidroid-v9-shift",
  name: "Triage 2026-05-14 - Omnidroid v9 ENEMY DETECTED shift ability",
  description:
    "Visual repro for Omnidroid v9 ENEMY DETECTED shift ability bug. P1 shifts Omnidroid v9 onto the Omnidroid v8 in play. After shifting, the ENEMY DETECTED ability should trigger and offer to deal 2 damage to a chosen character.",
  skipPreGame: true,
  playerOne: {
    inkwell: 3,
    hand: [omnidroidV9],
    play: [{ card: omnidroidV8, isDrying: false }],
    deck: 10,
    lore: 0,
  },
  playerTwo: {
    hand: [],
    play: [{ card: chiefTuiRespectedLeader, isDrying: false }],
    deck: 10,
    lore: 0,
  },
  seed: "triage-2026-05-14-omnidroid-v9-shift",
});
