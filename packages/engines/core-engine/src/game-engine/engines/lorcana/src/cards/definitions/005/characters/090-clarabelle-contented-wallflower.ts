import { drawACard } from "~/game-engine/engines/lorcana/src/abilities/effect";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const clarabelleContentedWallflower: LorcanaCharacterCardDefinition = {
  id: "qp1",
  missingTestCase: true,
  name: "Clarabelle",
  title: "Contented Wallflower",
  characteristics: ["storyborn", "ally"],
  text: "**ONE STEP BEHIND** When you play this character, if an opponent has more cards in their hand than you, you may draw a card.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "ONE STEP BEHIND",
      text: "When you play this character, if an opponent has more cards in their hand than you, you may draw a card.",
      optional: true,
      resolutionConditions: [
        {
          type: "hand",
          amount: "lt",
          player: "self",
        },
      ],
      effects: [drawACard],
    },
  ],
  flavour: "Golly! Those dancers can really moo-ve!",
  inkwell: true,
  colors: ["emerald"],
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  illustrator: "Lissette Carrera",
  number: 90,
  set: "SSK",
  rarity: "uncommon",
};
