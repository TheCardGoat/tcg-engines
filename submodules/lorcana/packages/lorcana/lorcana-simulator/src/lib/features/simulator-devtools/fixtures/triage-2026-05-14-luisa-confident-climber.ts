import { chiefTuiRespectedLeader } from "@tcg/lorcana-cards/cards/001";
import { mulanInjuredSoldier } from "@tcg/lorcana-cards/cards/004";
import { luisaMadrigalConfidentClimber } from "@tcg/lorcana-cards/cards/012";
import { createFixture } from "./fixture-factory";

export const triage20260514LuisaConfidentClimberFixture = createFixture({
  id: "triage-2026-05-14-luisa-confident-climber",
  name: "Triage 2026-05-14 - Luisa Confident Climber fourth damage",
  description:
    "Visual repro for digest reports #13/#23. Activate Luisa Madrigal - Confident Climber, move 1 damage from Mulan - Injured Soldier to Luisa, then choose opposing Chief Tui. Expected: Luisa reaches 4 damage only long enough to continue the ability, then all 4 damage move to Chief Tui; Luisa remains in play with 0 damage.",
  skipPreGame: true,
  playerOne: {
    inkwell: 1,
    hand: [],
    play: [
      { card: luisaMadrigalConfidentClimber, isDrying: false, damage: 3 },
      { card: mulanInjuredSoldier, isDrying: false, damage: 1 },
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
  seed: "triage-2026-05-14-luisa-confident-climber",
});
