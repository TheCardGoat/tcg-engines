import {
  bodyguardAbility,
  wardAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const ladyKluckProtectiveConfidant: LorcanaCharacterCardDefinition = {
  id: "m5f",
  name: "Lady Kluck",
  title: "Protective Confidant",
  characteristics: ["storyborn", "ally"],
  text: "Bodyguard\nWard",
  type: "character",
  abilities: [bodyguardAbility, wardAbility],
  inkwell: true,
  // @ts-expect-error
  color: "",
  colors: ["sapphire", "steel"],
  cost: 5,
  strength: 2,
  willpower: 7,
  illustrator: "Mariana Moreno",
  number: 172,
  set: "007",
  rarity: "uncommon",
  lore: 1,
};
