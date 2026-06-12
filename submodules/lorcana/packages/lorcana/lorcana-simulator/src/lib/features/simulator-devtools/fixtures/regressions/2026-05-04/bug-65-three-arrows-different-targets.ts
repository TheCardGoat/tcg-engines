import {
  buzzLightyearJungleRanger,
  fireflySwarm,
  hammPiggyBank,
  jessieLivelyCowgirl,
  lennyToyBinoculars,
  meridaFormidableArcherIconic,
  pizzaPlanetSpaceport,
  threeArrows,
  woodyJungleGuide,
} from "@tcg/lorcana-cards/cards/012";
import { createFixture } from "../../fixture-factory.js";
import { robinHoodSharpshooter } from "@tcg/lorcana-cards/cards/005";
//https://new.lorcanito.com/replay/mg70XYvphjVCCFkcmUhmAgi?step=104

export const bug65ThreeArrowsDifferentTargets = createFixture({
  id: "bug-65-three-arrows-different-targets",
  name: "Bug 65 - Three Arrows requireDifferentTargets",
  description:
    "P1 has Three Arrows in hand and 5 ink available. P2 has two characters in play (Chief Tui and Pete) so the player can attempt to retarget the same one across the action's two damage steps. Bug: requireDifferentTargets:true on step 2 may be bypassed — the same character could be picked twice. Correct behavior: play Three Arrows, deal 2 damage to character A on step 1, then on the optional step 2 character A is excluded from the picker (only character B is selectable).",
  playerOne: {
    play: [meridaFormidableArcherIconic, meridaFormidableArcherIconic, robinHoodSharpshooter],
    hand: [threeArrows],
    deck: [fireflySwarm],
    inkwell: 5,
    lore: 0,
  },
  playerTwo: {
    play: [
      { card: buzzLightyearJungleRanger, atLocation: pizzaPlanetSpaceport },
      { card: hammPiggyBank, atLocation: pizzaPlanetSpaceport },
      { card: jessieLivelyCowgirl, damage: 2 },
      { card: pizzaPlanetSpaceport },
      { card: woodyJungleGuide, damage: 2 },
      lennyToyBinoculars,
    ],
    deck: 10,
    lore: 0,
  },
  seed: "bug-65-three-arrows-different-targets",
  skipPreGame: true,
});
