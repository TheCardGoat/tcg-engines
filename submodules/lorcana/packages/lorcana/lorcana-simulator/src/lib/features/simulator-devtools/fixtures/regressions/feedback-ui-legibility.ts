import {
  dinglehopper,
  fishboneQuill,
  lantern,
  magicMirror,
  smash,
} from "@tcg/lorcana-cards/cards/001";
import {
  dragonGem,
  letTheStormRageOn,
  mauricesWorkshop,
  pawpsicle,
} from "@tcg/lorcana-cards/cards/002";
import { heartOfAtlantis, luckyDime } from "@tcg/lorcana-cards/cards/003";
import { grandmotherWillowAncientAdvisor } from "@tcg/lorcana-cards/cards/011";
import { createFixture } from "../fixture-factory.js";

export const feedbackUiLegibilityFixture = createFixture({
  id: "feedback-ui-legibility",
  name: "Feedback – UI legibility",
  description:
    "Grandmother Willow's player-effect marker and a crowded item zone for current layout, pagination, and overlap checks.",
  playerOne: {
    lore: 7,
    hand: [smash, letTheStormRageOn],
    play: [
      { card: grandmotherWillowAncientAdvisor, isDrying: false },
      fishboneQuill,
      pawpsicle,
      luckyDime,
      dinglehopper,
      lantern,
      magicMirror,
      dragonGem,
      mauricesWorkshop,
      heartOfAtlantis,
    ],
    inkwell: 4,
    deck: 5,
  },
  playerTwo: {
    lore: 4,
    deck: 5,
  },
  seed: "feedback-ui-legibility",
  skipPreGame: true,
});
