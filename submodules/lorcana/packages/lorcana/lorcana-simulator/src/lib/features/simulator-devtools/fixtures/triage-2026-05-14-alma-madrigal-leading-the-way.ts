import { chiefTuiRespectedLeader, mickeyMouseTrueFriend } from "@tcg/lorcana-cards/cards/001";
import {
  almaMadrigalLeadingTheWay,
  luisaMadrigalConfidentClimber,
} from "@tcg/lorcana-cards/cards/012";
import { createFixture } from "./fixture-factory";

export const triage20260514AlmaMadrigalLeadingTheWayFixture = createFixture({
  id: "triage-2026-05-14-alma-madrigal-leading-the-way",
  name: "Triage 2026-05-14 - Alma Madrigal Leading the Way PROTECTING THE FAMILY",
  description:
    "Visual repro for Alma Madrigal - Leading the Way PROTECTING THE FAMILY bug. P1 has another Madrigal in play. Play Alma — the ability should trigger and offer to exert one of P2's characters.",
  skipPreGame: true,
  playerOne: {
    inkwell: 5,
    hand: [almaMadrigalLeadingTheWay],
    play: [{ card: luisaMadrigalConfidentClimber, isDrying: false, damage: 0 }],
    deck: 10,
    lore: 0,
  },
  playerTwo: {
    hand: [],
    play: [
      { card: mickeyMouseTrueFriend, isDrying: false },
      { card: chiefTuiRespectedLeader, isDrying: false },
    ],
    deck: 10,
    lore: 0,
  },
  seed: "triage-2026-05-14-alma-madrigal-leading-the-way",
});
