// TODO: Once the set is released, we organize the cards by set and type
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const rafikiShamanOfTheSavanna: LorcanaCharacterCardDefinition = {
  id: "fwf",
  name: "Rafiki",
  title: "Shaman of the Savanna",
  characteristics: ["storyborn", "mentor", "sorcerer"],
  type: "character",
  abilities: [],
  inkwell: true,
  colors: ["amethyst"],
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  illustrator: "Giulia Riva",
  number: 42,
  set: "006",
  rarity: "common",
};
