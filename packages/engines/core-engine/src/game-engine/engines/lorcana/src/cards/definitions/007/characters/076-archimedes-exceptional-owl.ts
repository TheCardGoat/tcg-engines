import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
import { whenThisIsTargeted } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const archimedesExceptionalOwl: LorcanaCharacterCardDefinition = {
  notImplemented: true,
  id: "vig",
  name: "Archimedes",
  title: "Exceptional Owl",
  characteristics: ["storyborn", "ally"],
  text: "LEARN MORE Whenever an opponent chooses this character for an action or ability, you may draw a card.",
  type: "character",
  abilities: [
    whenThisIsTargeted({
      name: "LEARN MORE",
      text: "Whenever an opponent chooses this character for an action or ability, you may draw a card.",
      effects: drawACard,
    }),
  ],
  inkwell: true,
  colors: ["amethyst"],
  cost: 2,
  strength: 2,
  willpower: 2,
  illustrator: "Luis Huerta",
  number: 76,
  set: "007",
  rarity: "uncommon",
  lore: 1,
};
