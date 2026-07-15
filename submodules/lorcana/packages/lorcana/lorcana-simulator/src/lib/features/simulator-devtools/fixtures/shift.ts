import { createFixture } from "./fixture-factory";
import {
  friendsOnTheOtherSide,
  genieOnTheJob,
  geniePowersUnleashed,
  hakunaMatata,
  reflection,
} from "@tcg/lorcana-cards/cards/001";
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
  moanaDeterminedExplorer,
} from "@tcg/lorcana-cards/cards/005";
import { chipFriendIndeed, chipNDaleRecoveryRangers } from "@tcg/lorcana-cards/cards/006";
import { baymaxGiantRobot, thunderboltWonderDog } from "@tcg/lorcana-cards/cards/007";
import { dalmatianPuppyTailWagger, daleBumbler } from "@tcg/lorcana-cards/cards/008";
import { balooCarefreeBear, balooLaidbackBear } from "@tcg/lorcana-cards/cards/010";
import { aladdinGenieMischievousPals } from "@tcg/lorcana-cards/cards/013";

export const shiftFixture = createFixture({
  id: "shift",
  name: "Shift",
  description:
    "Testing shift UI: Universal Shift, Puppy Shift, discard-cost Shift, named Shift with multiple target names, and Set 13 Aladdin or Genie Shift",
  skipPreGame: true,
  playerOne: {
    inkwell: 20,
    hand: [
      baymaxGiantRobot,
      thunderboltWonderDog,
      diabloDevotedHerald,
      ursulaEricsBride,
      clarabelleLightOnHerHoovesEnchanted,
      balooCarefreeBear,
      geniePowersUnleashed,
      chipNDaleRecoveryRangers,
      aladdinBraveRescuer,
      aladdinGenieMischievousPals,
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
      balooLaidbackBear,
      genieOnTheJob,
      chipFriendIndeed,
      daleBumbler,
      moanaDeterminedExplorer,
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
