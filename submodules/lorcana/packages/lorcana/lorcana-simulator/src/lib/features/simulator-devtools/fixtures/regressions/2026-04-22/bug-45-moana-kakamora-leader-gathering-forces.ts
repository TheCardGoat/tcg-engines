import {
  kakamoraBoardingParty,
  kakamoraLongrangeSpecialist,
  kakamoraPiratePitcher,
  moanaKakamoraLeader,
  flotillaCoconutArmada,
} from "@tcg/lorcana-cards/cards/006";
import { createFixture } from "../../fixture-factory.js";
import { goofySetForAdventure, hiddenCoveTranquilHaven } from "@tcg/lorcana-cards/cards/009";
import { leviathansLairDangerousGround, touchTheSky } from "@tcg/lorcana-cards/cards/012";

export const bug45MoanaKakamoraLeaderGatheringForcesFixture = createFixture({
  id: "bug-45-moana-kakamora-leader-gathering-forces",
  name: "Bug 45 - Moana Kakamora Leader / GATHERING FORCES multi-character move",
  description:
    "Moana - Kakamora Leader in hand with 3 Kakamora characters and the Flotilla Coconut Armada location in play. Playing Moana should offer a prompt to move ANY NUMBER of your characters to the same location. Reported: only 1 character slot appears but up to 5 location slots.",
  playerOne: {
    hand: [moanaKakamoraLeader, touchTheSky],
    inkwell: moanaKakamoraLeader.cost,
    play: [
      goofySetForAdventure,
      kakamoraBoardingParty,
      kakamoraLongrangeSpecialist,
      kakamoraPiratePitcher,
      flotillaCoconutArmada,
      hiddenCoveTranquilHaven,
      leviathansLairDangerousGround,
    ],
    deck: 10,
  },
  playerTwo: {
    deck: 10,
  },
  seed: "bug-45-moana-kakamora-leader-gathering-forces",
  skipPreGame: true,
});
