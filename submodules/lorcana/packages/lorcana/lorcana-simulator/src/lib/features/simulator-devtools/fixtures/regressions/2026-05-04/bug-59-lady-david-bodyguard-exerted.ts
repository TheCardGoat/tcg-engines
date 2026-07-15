import { ladyFamilyDog } from "@tcg/lorcana-cards/cards/008";
import {
  hammPiggyBank,
  montereyJackWatchfulRanger,
  rexProtectiveDinosaur,
} from "@tcg/lorcana-cards/cards/012";
import { createFixture } from "../../fixture-factory.js";

export const bug59LadyDavidBodyguardExerted = createFixture({
  id: "bug-59-lady-david-bodyguard-exerted",
  name: "Bug 59 - Lady free-play does not surface Bodyguard exerted-entry choice",
  description:
    "P1 has Lady - Family Dog ready in play. SOMEONE TO CARE FOR triggers when Lady is played and lets the controller play a character with cost 2 or less for free from hand. P1's hand contains Rex - Protective Dinosaur (Bodyguard) and Hamm - Piggy Bank to exercise the picker. Trigger Lady's ability (e.g., by replaying her or via existing trigger) and select Rex via the free-play step. Bug: Rex has Bodyguard, so the player should be prompted to choose whether Rex enters play exerted, but the prompt is never surfaced. Optionally, P2's Monterey Jack is in play ready so the Bodyguard challenge restriction can be verified once Rex is in play.",
  playerOne: {
    play: [{ card: ladyFamilyDog, isDrying: false }],
    hand: [rexProtectiveDinosaur, ladyFamilyDog, hammPiggyBank],
    inkwell: 5,
    deck: 10,
    lore: 0,
  },
  playerTwo: {
    play: [{ card: montereyJackWatchfulRanger, isDrying: false }],
    deck: 10,
    lore: 0,
  },
  seed: "bug-59-lady-david-bodyguard-exerted",
  skipPreGame: true,
});
