import { arielOnHumanLegs, simbaProtectiveCub } from "@tcg/lorcana-cards/cards/001";
import { leviathansLairDangerousGround } from "@tcg/lorcana-cards/cards/012";
import { createFixture } from "../../fixture-factory.js";

export const leviathansLairHandVsPlayRegression = createFixture({
  id: "leviathans-lair-hand-vs-play",
  name: "Leviathan's Lair - Hand vs Play Targeting",
  description:
    "Visual validation for Leviathan's Lair - Dangerous Ground. P1 controls Leviathan's Lair. P2 has Simba - Protective Cub in play and Ariel - On Human Legs in hand. Banish the location with the debug/manual damage control, then switch to P2. Expected: the LOST TO THE DUNES prompt highlights only Simba in play as a valid banish target; Ariel in hand must not be selectable.",
  skipPreGame: true,
  seed: "leviathans-lair-hand-vs-play",
  playerOne: {
    hand: [],
    play: [leviathansLairDangerousGround],
    deck: 10,
    lore: 0,
  },
  playerTwo: {
    hand: [arielOnHumanLegs],
    play: [{ card: simbaProtectiveCub, isDrying: false }],
    deck: 10,
    lore: 0,
  },
});
