import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const donaldDuck: LorcanaCharacterCardDefinition = {
  id: "ni4",
  name: "Donald Duck",
  title: "Boisterous Fowl",
  characteristics: ["storyborn"],
  type: "character",
  flavour: "„Who you callin' boisterous, buster?",
  inkwell: true,
  colors: ["ruby"],
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  illustrator: "Kenneth Anderson",
  number: 108,
  set: "TFC",
  rarity: "uncommon",
};
