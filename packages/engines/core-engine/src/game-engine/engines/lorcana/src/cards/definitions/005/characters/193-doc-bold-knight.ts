import type {
  LorcanitoCharacterCard,
  ResolutionAbility,
} from "@lorcanito/lorcana-engine";
import {
  discardYourHand,
  drawXCards,
} from "@lorcanito/lorcana-engine/effects/effects";

const drasticMeasures: ResolutionAbility = {
  type: "resolution",
  name: "Drastic Measures",
  text: "When you play this character, you may discard your hand to draw 2 cards.",
  optional: true,
  effects: [discardYourHand, drawXCards(2)],
};

export const docBoldKnight: LorcanaCharacterCardDefinition = {
  id: "bsn",
  name: "Doc",
  title: "Bold Knight",
  characteristics: ["dreamborn", "ally", "knight", "seven dwarfs"],
  text: "**DRASTIC MEASURES** When you play this character, you may discard your hand to draw 2 cards.",
  type: "character",
  abilities: [drasticMeasures],
  colors: ["steel"],
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  illustrator: "Mariana Moreno",
  number: 193,
  set: "SSK",
  rarity: "rare",
};
