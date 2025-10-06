// TODO: Once the set is released, we organize the cards by set and type

import { wardAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/wardAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const princePhillipRoyalExplorer: LorcanaCharacterCardDefinition = {
  id: "p99",
  name: "Prince Phillip",
  title: "Royal Explorer",
  characteristics: ["storyborn", "hero", "prince"],
  text: "Ward (Opponents can't choose this character except to challenge.)",
  type: "character",
  abilities: [wardAbility],
  inkwell: true,
  colors: ["emerald"],
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 2,
  illustrator: "Gaku Kumatori",
  number: 83,
  set: "006",
  rarity: "uncommon",
};
