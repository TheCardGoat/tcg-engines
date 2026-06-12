import { chiefTuiRespectedLeader } from "@tcg/lorcana-cards/cards/001";
import { mulanInjuredSoldier } from "@tcg/lorcana-cards/cards/004";
import {
  isabelaMadrigalPerfectlyInControl,
  luisaMadrigalConfidentClimber,
} from "@tcg/lorcana-cards/cards/012";
import { createFixture } from "./fixture-factory";

export const triage20260516LuisaAndIsabelaFeelBetterFixture = createFixture({
  id: "triage-2026-05-16-luisa-and-isabela-feel-better",
  name: "Triage 2026-05-16 — Luisa + Isabela `to: SELF` move-damage",
  description:
    "Hand-test PR #114: both Luisa Madrigal — Confident Climber (`I CAN TAKE IT`) and Isabela Madrigal — Perfectly in Control (`FEEL BETTER`) use the `from: CHOSEN_CHARACTER_OF_YOURS, to: SELF` move-damage direction. Pre-PR-114 the engine→UI converter assumed the auto-bound slot was always FROM, which silently dropped both prompts. Steps: (1) activate Luisa `I CAN TAKE IT` (1 ink) → prompt should ask for a damaged character of yours (Mulan or Chief Tui); damage transfers to Luisa. (2) quest Isabela → `FEEL BETTER` triggers; prompt should ask for a damaged character of yours; all damage moves onto Isabela. With the fix, both prompts confirm; without it, the bag stays pending and neither effect resolves.",
  skipPreGame: true,
  playerOne: {
    inkwell: 3,
    hand: [],
    play: [
      { card: luisaMadrigalConfidentClimber, isDrying: false },
      { card: isabelaMadrigalPerfectlyInControl, isDrying: false },
      { card: mulanInjuredSoldier, isDrying: false, damage: 2 },
      { card: chiefTuiRespectedLeader, isDrying: false, damage: 1 },
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
  seed: "triage-2026-05-16-luisa-and-isabela-feel-better",
});
