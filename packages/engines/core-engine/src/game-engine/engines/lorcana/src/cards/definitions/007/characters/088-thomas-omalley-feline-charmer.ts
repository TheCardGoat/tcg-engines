import { wardAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/wardAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const thomasOmalleyFelineCharmer: LorcanaCharacterCardDefinition = {
  id: "q6a",
  name: "Thomas O'malley",
  title: "Feline Charmer",
  characteristics: ["storyborn", "hero"],
  text: "Ward",
  type: "character",
  abilities: [wardAbility],
  inkwell: true,
  colors: ["emerald"],
  cost: 3,
  strength: 4,
  willpower: 2,
  illustrator: "Kasia Brzezinska",
  number: 88,
  set: "007",
  rarity: "uncommon",
  lore: 1,
};
