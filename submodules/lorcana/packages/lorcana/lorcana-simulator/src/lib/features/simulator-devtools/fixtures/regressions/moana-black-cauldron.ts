import {
  belleStrangeButSpecial,
  chiefTuiRespectedLeader,
  donaldDuckStruttingHisStuff,
  grammaTalaStoryteller,
  heiheiBoatSnack,
  partOfYourWorld,
  ransack,
} from "@tcg/lorcana-cards/cards/001";
import {
  heiheiPersistentPresence,
  peteBadGuy,
  theNokkWaterSpirit,
} from "@tcg/lorcana-cards/cards/002";
import { createFixture } from "../fixture-factory.js";
import {
  chiefTuiWeavingATale,
  grammaTalaConnectedToNature,
  moanaCuriousExplorer,
} from "@tcg/lorcana-cards/cards/011";
import { hadesLookingForADeal, theBlackCauldronEnchanted } from "@tcg/lorcana-cards/cards/010";
import { tipoGrowingSon } from "@tcg/lorcana-cards/cards/005";
import { heiheiNotsotrickyChicken, sailTheAzuriteSea } from "@tcg/lorcana-cards/cards/006";
import { heiheiBumblingRooster } from "@tcg/lorcana-cards/cards/004";
import {
  chiefTuiProudOfMotunui,
  grammaTalaKeeperOfAncientStories,
  heiheiAccidentalExplorer,
} from "@tcg/lorcana-cards/cards/003";

export const moanaBlackCauldron = createFixture({
  id: "moana-curious-explorer-black-cauldron",
  name: "Moana Curious Explorer and Black Cauldron",
  description: "Testing the UI interaction for both characters",
  playerOne: {
    hand: [tipoGrowingSon, sailTheAzuriteSea, belleStrangeButSpecial],
    play: [
      moanaCuriousExplorer,
      {
        card: theBlackCauldronEnchanted,
        cardsUnder: [
          { card: peteBadGuy, publicFaceState: "faceUp" as const },
          { card: chiefTuiProudOfMotunui, publicFaceState: "faceUp" as const },
        ],
      },
    ],
    inkwell: 15,
    deck: [
      heiheiBoatSnack,
      heiheiBumblingRooster,
      heiheiAccidentalExplorer,
      heiheiNotsotrickyChicken,
      heiheiPersistentPresence,
    ],
    discard: [
      hadesLookingForADeal,
      chiefTuiWeavingATale,
      chiefTuiRespectedLeader,
      grammaTalaConnectedToNature,
      grammaTalaStoryteller,
      grammaTalaKeeperOfAncientStories,
    ],
  },
  playerTwo: {
    hand: [tipoGrowingSon, sailTheAzuriteSea],
    inkwell: [peteBadGuy],
    deck: [
      chiefTuiProudOfMotunui,
      chiefTuiWeavingATale,
      chiefTuiRespectedLeader,
      grammaTalaConnectedToNature,
      grammaTalaStoryteller,
      grammaTalaKeeperOfAncientStories,
    ],
  },
  seed: "moana-curious-explorer-black-cauldron",
  skipPreGame: true,
});
