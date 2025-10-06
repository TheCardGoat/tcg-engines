// TODO: Once the set is released, we organize the cards by set and type
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const dawsonBasilsAssistant: LorcanaCharacterCardDefinition = {
  id: "nga",
  name: "Dawson",
  title: "Basil's Assistant",
  characteristics: ["storyborn", "ally"],
  type: "character",
  abilities: [],
  inkwell: true,
  colors: ["emerald"],
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  illustrator: "Brittney Hackett",
  number: 77,
  set: "006",
  rarity: "common",
};
