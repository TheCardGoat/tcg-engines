// TODO: Once the set is released, we organize the cards by set and type
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const genieExcitedShipbuilder: LorcanaCharacterCardDefinition = {
  id: "j9a",
  name: "Genie",
  title: "Excited Shipbuilder",
  characteristics: ["storyborn", "ally"],
  type: "character",
  inkwell: true,
  colors: ["amethyst"],
  cost: 3,
  strength: 4,
  willpower: 3,
  lore: 1,
  illustrator: "Stefano Zanchi",
  number: 38,
  set: "006",
  rarity: "common",
};
