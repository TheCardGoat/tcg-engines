import { createFixture } from "./fixture-factory";
import {
  _99Puppies,
  divebomb,
  lastditchEffort,
  lyleTiberiusRourkeCunningMercenary,
} from "@tcg/lorcana-cards/cards/003";
import {
  diabloObedientRaven,
  loseTheWay,
  theCarpenterDinnerCompanion,
} from "@tcg/lorcana-cards/cards/006";
import {
  bePrepared,
  dragonFire,
  hakunaMatata,
  maleficentSorceress,
  marshmallowPersistentGuardian,
  mickeyMouseTrueFriend,
  reflection,
  tinkerBellGiantFairy,
} from "@tcg/lorcana-cards/cards/001";
import { heiheiPersistentPresence, mufasaBetrayedLeader } from "@tcg/lorcana-cards/cards/002";
import { belleSnowfieldStrategist, ragingStorm } from "@tcg/lorcana-cards/cards/011";
import {
  belleAccomplishedMysticEnchanted,
  julietaMadrigalExcellentCook,
  kuzcoWantedLlama,
  powerlineWorldsGreatestRockStar,
} from "@tcg/lorcana-cards/cards/009";
import {
  candleheadDedicatedRacer,
  lyleTiberiusRourkeCrystallizedMercenary,
} from "@tcg/lorcana-cards/cards/007";
import {
  amethystChromicon,
  emeraldChromicon,
  moanaDeterminedExplorer,
} from "@tcg/lorcana-cards/cards/005";
import { brunoMadrigalOutOfTheShadows, theQueenDiviner } from "@tcg/lorcana-cards/cards/004";
import {
  calhounHardnosedLeader,
  mickeyMouseGiantMouse,
  vinnieGreenPigeon,
} from "@tcg/lorcana-cards/cards/008";
import {
  ichabodCraneBookishSchoolmaster,
  ichabodCraneScaredOutOfHisMind,
} from "@tcg/lorcana-cards/cards/010";

export const multipleTriggers = createFixture({
  id: "multiple-triggers",
  name: "Multiple Triggers",
  description: "Testing scenario where multiple triggers fire at once",
  skipPreGame: true,
  playerOne: {
    inkwell: 20,
    hand: [ragingStorm, bePrepared],
    play: [
      belleSnowfieldStrategist,
      belleAccomplishedMysticEnchanted,
      powerlineWorldsGreatestRockStar,
      marshmallowPersistentGuardian,
      heiheiPersistentPresence,
      kuzcoWantedLlama,
      ichabodCraneBookishSchoolmaster,
      ichabodCraneScaredOutOfHisMind,
      mickeyMouseGiantMouse,
      candleheadDedicatedRacer,
    ],
    deck: [
      dragonFire,
      loseTheWay,
      reflection,
      brunoMadrigalOutOfTheShadows,
      hakunaMatata,
      moanaDeterminedExplorer,
      julietaMadrigalExcellentCook,
      _99Puppies,
    ],
  },
  playerTwo: {
    hand: [mickeyMouseTrueFriend, divebomb, lastditchEffort],
    play: [
      mufasaBetrayedLeader,
      amethystChromicon,
      lyleTiberiusRourkeCrystallizedMercenary,
      lyleTiberiusRourkeCunningMercenary,
      calhounHardnosedLeader,
      theCarpenterDinnerCompanion,
      diabloObedientRaven,
      vinnieGreenPigeon,
      emeraldChromicon,
    ],
    deck: [tinkerBellGiantFairy, maleficentSorceress],
  },
});
