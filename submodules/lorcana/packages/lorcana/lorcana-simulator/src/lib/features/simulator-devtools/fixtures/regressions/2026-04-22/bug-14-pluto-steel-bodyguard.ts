import { aladdinCorneredSwordsman, dinglehopper } from "@tcg/lorcana-cards/cards/001";
import { plutoSteelChampion } from "@tcg/lorcana-cards/cards/010";
import { createFixture } from "../../fixture-factory.js";

// Player report (2026-04-25):
//   "Is Pluto Steel Champion bugged in 2.0? I was trying to use his effect of
//    destroying opponents items, but I was unable to make an actual selection
//    to destroy something."
//
// MAKE ROOM: "Whenever you play another Steel character, you may banish chosen
// item." This fixture sets the controller up to play a Steel character (Aladdin
// - Cornered Swordsman) while an opposing Dinglehopper sits in play, so the
// optional target prompt should surface with the opposing item selectable.
//
// NOTE: "Pluto - Steel Bodyguard" does not exist; Pluto - Steel Champion (010)
// is the closest available printing for this archetype.
export const bug14PlutoSteelBodyguard = createFixture({
  id: "bug-14-pluto-steel-bodyguard",
  name: "Bug 14 - Pluto, Steel Champion (MAKE ROOM target prompt)",
  description:
    "Pluto - Steel Champion in play with a Steel character ready to play from hand and an opposing Dinglehopper item in play. Playing the Steel character should trigger MAKE ROOM and surface a target prompt allowing the opposing item to be banished.",
  playerOne: {
    play: [{ card: plutoSteelChampion, isDrying: false }],
    hand: [aladdinCorneredSwordsman],
    inkwell: 4,
    deck: [aladdinCorneredSwordsman, aladdinCorneredSwordsman, aladdinCorneredSwordsman],
  },
  playerTwo: {
    play: [dinglehopper],
    deck: [dinglehopper, dinglehopper, dinglehopper],
  },
  seed: "bug-14-pluto-steel-bodyguard",
  skipPreGame: true,
});
