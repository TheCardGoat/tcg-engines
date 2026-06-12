import { createFixture } from "./fixture-factory";
import { friendsOnTheOtherSide, hakunaMatata, reflection } from "@tcg/lorcana-cards/cards/001";
import { diabloFaithfulPet } from "@tcg/lorcana-cards/cards/003";
import {
  aladdinBraveRescuer,
  aladdinResoluteSwordsman,
  diabloDevotedHerald,
  flotsamJetsamEntanglingEels,
  flotsamUrsulasBaby,
  hiddenCoveTranquilHaven,
  jetsamUrsulasBaby,
  ursulaEricsBride,
  ursulaVanessa,
} from "@tcg/lorcana-cards/cards/004";
import {
  clarabelleClumsyGuest,
  clarabelleLightOnHerHoovesEnchanted,
} from "@tcg/lorcana-cards/cards/005";
import { baymaxGiantRobot, thunderboltWonderDog } from "@tcg/lorcana-cards/cards/007";
import { dalmatianPuppyTailWagger } from "@tcg/lorcana-cards/cards/008";

export const shiftFixture = createFixture({
  id: "shift",
  name: "Shift",
  description:
    "Testing shift UI: Universal Shift, Puppy Shift, discard-cost Shift, and named Shift with multiple target names",
  skipPreGame: true,
  playerOne: {
    inkwell: 20,
    hand: [
      baymaxGiantRobot,
      thunderboltWonderDog,
      diabloDevotedHerald,
      ursulaEricsBride,
      clarabelleLightOnHerHoovesEnchanted,
      aladdinBraveRescuer,
      flotsamJetsamEntanglingEels,
      reflection,
      hakunaMatata,
      hiddenCoveTranquilHaven,
      friendsOnTheOtherSide,
    ],
    play: [
      dalmatianPuppyTailWagger,
      diabloFaithfulPet,
      ursulaVanessa,
      clarabelleClumsyGuest,
      aladdinResoluteSwordsman,
      flotsamUrsulasBaby,
      jetsamUrsulasBaby,
    ],
    deck: [reflection, hakunaMatata],
  },
  playerTwo: {
    hand: [reflection, hakunaMatata],
    play: [],
    deck: [hakunaMatata, reflection],
  },
});
