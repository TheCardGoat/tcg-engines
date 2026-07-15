import {
  aladdinPrinceAli,
  arielOnHumanLegs,
  bePrepared,
  dragonFire,
  healingGlow,
  simbaProtectiveCub,
  tinkerBellPeterPansAlly,
} from "@tcg/lorcana-cards/cards/001";
import { andThenAlongCameZeus, theBareNecessities } from "@tcg/lorcana-cards/cards/003";
import { secondStarToTheRight } from "@tcg/lorcana-cards/cards/004";
import { merlinsCottageTheWizardsHome } from "@tcg/lorcana-cards/cards/005";
import { waterHasMemory } from "@tcg/lorcana-cards/cards/007";
import { undermine } from "@tcg/lorcana-cards/cards/008";
import {
  annaLittleSister,
  copperHoundPup,
  doYouWantToBuildASnowman,
  kristoffIcyExplorer,
  taranMagicallyArmed,
} from "@tcg/lorcana-cards/cards/011";
import { createFixture } from "./fixture-factory";

export const playerSelectionFixture = createFixture({
  id: "player-selection",
  name: "Player Selection",
  description:
    "Manual player-targeting sandbox covering direct chosen-player effects, chosen-player hidden-zone interactions, and chosen-player follow-up choice flows.",
  skipPreGame: true,
  playerOne: {
    inkwell: 20,
    hand: [
      secondStarToTheRight,
      copperHoundPup,
      theBareNecessities,
      waterHasMemory,
      annaLittleSister,
      doYouWantToBuildASnowman,
      undermine,
      taranMagicallyArmed,
    ],
    play: [{ card: kristoffIcyExplorer, isDrying: false }],
    deck: [
      aladdinPrinceAli,
      arielOnHumanLegs,
      healingGlow,
      simbaProtectiveCub,
      dragonFire,
      andThenAlongCameZeus,
    ],
    discard: [tinkerBellPeterPansAlly],
  },
  playerTwo: {
    hand: [bePrepared, merlinsCottageTheWizardsHome, tinkerBellPeterPansAlly],
    play: [
      { card: copperHoundPup, isDrying: false },
      { card: kristoffIcyExplorer, isDrying: false },
    ],
    deck: [
      dragonFire,
      arielOnHumanLegs,
      healingGlow,
      aladdinPrinceAli,
      simbaProtectiveCub,
      andThenAlongCameZeus,
    ],
    discard: [tinkerBellPeterPansAlly, merlinsCottageTheWizardsHome],
  },
});
