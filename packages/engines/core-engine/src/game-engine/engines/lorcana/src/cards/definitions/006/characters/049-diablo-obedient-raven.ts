// TODO: Once the set is released, we organize the cards by set and type

import { drawACard } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { whenThisCharacterBanished } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const diabloObedientRaven: LorcanaCharacterCardDefinition = {
  id: "gsz",
  name: "Diablo",
  title: "Obedient Raven",
  characteristics: ["storyborn", "ally"],
  text: "FLY, MY PET! When this character is banished, you may draw a card.",
  type: "character",
  abilities: [
    whenThisCharacterBanished({
      name: "Fly, My Pet!",
      text: "When this character is banished, you may draw a card.",
      optional: true,
      effects: [drawACard],
    }),
  ],
  inkwell: true,
  colors: ["amethyst"],
  cost: 1,
  strength: 0,
  willpower: 1,
  lore: 1,
  illustrator: "Jennifer Wu",
  number: 49,
  set: "006",
  rarity: "uncommon",
};
