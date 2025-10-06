// TODO: Once the set is released, we organize the cards by set and type

import { wardAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/wardAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const heathcliffStoicButler: LorcanaCharacterCardDefinition = {
  id: "rhq",
  name: "Heathcliff",
  title: "Stoic Butler",
  characteristics: ["storyborn", "ally"],
  text: "Ward (Opponents can't choose this character except to challenge.)",
  type: "character",
  abilities: [wardAbility],
  inkwell: true,
  colors: ["emerald"],
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  illustrator: "Veronica Di Lorenzo / Livio Cacciatore",
  number: 78,
  set: "006",
  rarity: "uncommon",
};
