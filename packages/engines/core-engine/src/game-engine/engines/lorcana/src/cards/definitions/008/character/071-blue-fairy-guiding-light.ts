import {
  evasiveAbility,
  supportAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const blueFairyGuidingLight: LorcanaCharacterCardDefinition = {
  id: "atk",
  name: "Blue Fairy",
  title: "Guiding Light",
  characteristics: ["storyborn", "ally", "fairy"],
  text: "Evasive\nSupport",
  type: "character",
  abilities: [evasiveAbility, supportAbility],
  inkwell: true,
  colors: ["amethyst", "sapphire"],
  cost: 2,
  strength: 2,
  willpower: 2,
  illustrator: "Mandi Kandaylan Manderson",
  number: 71,
  set: "008",
  rarity: "uncommon",
  lore: 1,
};
