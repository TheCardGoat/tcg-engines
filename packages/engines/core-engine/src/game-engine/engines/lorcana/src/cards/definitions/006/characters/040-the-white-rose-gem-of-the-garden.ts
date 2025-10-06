// TODO: Once the set is released, we organize the cards by set and type

import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const theWhiteRoseGemOfTheGarden: LorcanaCharacterCardDefinition = {
  id: "xng",
  name: "The White Rose",
  title: "Jewel of the Garden",
  characteristics: ["storyborn"],
  text: "THE BEAUTY OF THE WORLD When you play this character, gain 1 lore.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "A Wealth of Happiness",
      text: "When you play this character, gain 1 lore.",
      effects: [youGainLore(1)],
    },
  ],
  inkwell: true,
  colors: ["amethyst"],
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  illustrator: "Cory Godbey",
  number: 40,
  set: "006",
  rarity: "common",
};
