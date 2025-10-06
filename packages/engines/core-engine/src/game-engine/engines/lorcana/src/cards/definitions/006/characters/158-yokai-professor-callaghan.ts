// TODO: Once the set is released, we organize the cards by set and type
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const yokaiProfessorCallaghan: LorcanaCharacterCardDefinition = {
  id: "upo",
  name: "Yokai",
  title: "Professor Callaghan",
  characteristics: ["storyborn", "villain", "inventor"],
  type: "character",
  inkwell: true,
  colors: ["sapphire"],
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  illustrator: "Jennifer Park",
  number: 158,
  set: "006",
  rarity: "common",
};
