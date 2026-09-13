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
    "Two full item shelves plus a seven-card opponent hand for desktop and mobile visibility, overlap, and pagination checks.",
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
    lore: 13,
    hand: [
      smash,
      letTheStormRageOn,
      fishboneQuill,
      lantern,
      magicMirror,
      dragonGem,
      mauricesWorkshop,
    ],
    play: [
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
    inkwell: 8,
    deck: 21,
  },
  seed: "feedback-ui-legibility",
  skipPreGame: true,
});
