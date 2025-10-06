import { putChosenCardFromYourHandIntoYourInkwellExerted } from "~/game-engine/engines/lorcana/src/abilities/effect";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const tipoGrowingSon: LorcanaCharacterCardDefinition = {
  id: "tq0",
  name: "Tipo",
  title: "Growing Son",
  characteristics: ["storyborn", "ally"],
  text: "**MEASURE ME AGAIN** When you play this character, you may put a card from your hand into your inkwell facedown and exerted.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "MEASURE ME AGAIN",
      text: "When you play this character, you may put a card from your hand into your inkwell facedown and exerted.",
      optional: true,
      isPrivate: true,
      effects: [putChosenCardFromYourHandIntoYourInkwellExerted],
    },
  ],
  flavour: '"Mom, Mom! I think I’m still growing!"',
  inkwell: true,
  colors: ["sapphire"],
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
  illustrator: "Kapik",
  number: 157,
  set: "SSK",
  rarity: "uncommon",
};
