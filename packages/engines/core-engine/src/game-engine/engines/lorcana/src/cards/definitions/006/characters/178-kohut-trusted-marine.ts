// TODO: Once the set is released, we organize the cards by set and type
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const kohutTrustedMarine: LorcanitoCharacterCardDefinition = {
  id: "dry",
  name: "Kohut",
  title: "Trusted Marine",
  characteristics: ["storyborn", "ally"],
  type: "character",
  inkwell: true,
  colors: ["steel"],
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  illustrator: "Kevin Sidharta",
  number: 178,
  set: "006",
  rarity: "common",
};
