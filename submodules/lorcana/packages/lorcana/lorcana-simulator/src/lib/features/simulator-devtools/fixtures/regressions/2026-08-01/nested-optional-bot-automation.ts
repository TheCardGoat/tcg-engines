import { dinglehopper, heiheiBoatSnack, reflection } from "@tcg/lorcana-cards/cards/001";
import { julietaMadrigalExcellentCook } from "@tcg/lorcana-cards/cards/004";
import {
  chernabogUnnaturalForce,
  darkwingDuckDashingGadgeteer,
} from "@tcg/lorcana-cards/cards/011";
import { pocahontasMeekoAdventurousFriends } from "@tcg/lorcana-cards/cards/013";
import { createFixture } from "../../fixture-factory.js";

/**
 * Visual validation board for multi-may ("you may A. If you do, you may B")
 * abilities that previously deadlocked the AI into concede.
 *
 * Open: http://localhost:5174/tests/regressions/nested-optional-bot-automation
 *
 * How to use:
 * 1. Meeko (play, ready) — Quest → WELCOME RETURN: return cost-1 HeiHei → free-play cost-1.
 *    Or put opponent AI on Auto and pass priority so the bot resolves the nested mays.
 * 2. Julieta (hand) — Play with ink → SIGNATURE RECIPE: remove damage from HeiHei → optional draw.
 * 3. Darkwing (play, ready) — Quest → MODERN MARVEL: put Dinglehopper bottom → free-play item ≤5.
 * 4. Chernabog (hand) — Play with ink → DARK DANCE: shuffle opposing Mickey → opp may free-play.
 */
export const nestedOptionalBotAutomationRegression = createFixture({
  id: "nested-optional-bot-automation",
  name: "Nested optional bot automation (Meeko / Julieta / Darkwing / Chernabog)",
  description:
    "Visual board for nested multi-may abilities that used to leave the AI stuck conceding. Quest Meeko or Darkwing, play Julieta or Chernabog, and use AI Step/Auto (or resolve prompts yourself) to confirm bag/pending clears without a concede.",
  skipPreGame: true,
  seed: "nested-optional-bot-automation-2026-08-01",
  playerOne: {
    // Ink for Julieta (3) + Chernabog (9) + headroom
    inkwell: 12,
    hand: [
      julietaMadrigalExcellentCook,
      chernabogUnnaturalForce,
      // Extra cost-1 for free-play after Meeko bounce
      heiheiBoatSnack,
      // Extra item for Darkwing free-play after bottoming Dinglehopper
      dinglehopper,
      reflection,
    ],
    play: [
      // Quest → WELCOME RETURN nested mays
      { card: pocahontasMeekoAdventurousFriends, isDrying: false },
      // Cost-1 bounce target for Meeko; also damaged for Julieta remove-damage
      { card: heiheiBoatSnack, isDrying: false, damage: 1 },
      // Quest → MODERN MARVEL nested mays
      { card: darkwingDuckDashingGadgeteer, isDrying: false },
    ],
    discard: [
      // Item for Darkwing "put on bottom of deck" step
      dinglehopper,
    ],
    deck: [reflection, reflection, reflection, reflection, heiheiBoatSnack, dinglehopper],
    lore: 0,
  },
  playerTwo: {
    hand: [],
    // Opposing character for Chernabog shuffle
    play: [{ card: heiheiBoatSnack, isDrying: false }],
    discard: [
      // Free-play candidate for opponent after Chernabog if-you-do
      heiheiBoatSnack,
    ],
    deck: 10,
    lore: 0,
  },
});
