// TODO: Once the set is released, we organize the cards by set and type
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const kingHubertPhillipsFather: LorcanaCharacterCardDefinition = {
  id: "q63",
  name: "King Hubert",
  title: "Phillip's Father",
  characteristics: ["storyborn", "mentor", "king"],
  type: "character",
  inkwell: true,
  colors: ["steel"],
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  illustrator: "Gaku Kumatori",
  number: 179,
  set: "006",
  rarity: "common",
};
