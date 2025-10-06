// TODO: Once the set is released, we organize the cards by set and type
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const michaelDarlingPlayfulSwordsman: LorcanaCharacterCardDefinition = {
  id: "zba",
  name: "Michael Darling",
  title: "Playful Swordsman",
  characteristics: ["storyborn", "ally", "pirate"],
  type: "character",
  inkwell: true,
  colors: ["ruby"],
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  illustrator: "Filipe Laurentino",
  number: 111,
  set: "006",
  rarity: "common",
};
