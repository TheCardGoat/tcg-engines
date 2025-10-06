import {
  evasiveAbility,
  supportAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const perlaNimbleSeamstress: LorcanaCharacterCardDefinition = {
  id: "t6h",
  name: "Perla",
  title: "Nimble Seamstress",
  characteristics: ["storyborn", "ally"],
  text: "Evasive\nSupport ",
  type: "character",
  abilities: [evasiveAbility, supportAbility],
  inkwell: true,
  // @ts-expect-error
  color: "",
  colors: ["amber", "emerald"],
  cost: 3,
  strength: 3,
  willpower: 2,
  illustrator: "Kapik",
  number: 32,
  set: "007",
  rarity: "uncommon",
  lore: 1,
};
