import { chiefTuiRespectedLeader } from "@tcg/lorcana-cards/cards/001";
import { mulanInjuredSoldier } from "@tcg/lorcana-cards/cards/004";
import { luisaMadrigalConfidentClimber } from "@tcg/lorcana-cards/cards/012";
import { createFixture } from "./fixture-factory";

export const triage20260518LuisaMulanMoveDamageFixture = createFixture({
  id: "triage-2026-05-18-luisa-mulan-move-damage",
  name: "Triage 2026-05-18 - Luisa + Mulan move damage",
  description:
    "Visual validation for Luisa Madrigal - Confident Climber's I CAN TAKE IT against both destination states. P1 controls two ready Luisas: one with 0 damage and one with 2 damage, plus Mulan - Injured Soldier with 2 damage. Activate the undamaged Luisa and choose Mulan: 1 damage should move to Luisa without opening the opposing-character follow-up. Then activate the damaged Luisa and choose Mulan: 1 damage should move to Luisa, she should reach 3 damage, and the follow-up should let you move all damage from that Luisa to opposing Chief Tui.",
  skipPreGame: true,
  playerOne: {
    inkwell: 2,
    hand: [],
    play: [
      { card: luisaMadrigalConfidentClimber, isDrying: false, damage: 0 },
      { card: luisaMadrigalConfidentClimber, isDrying: false, damage: 2 },
      { card: mulanInjuredSoldier, isDrying: false, damage: 2 },
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
  seed: "triage-2026-05-18-luisa-mulan-move-damage",
});
