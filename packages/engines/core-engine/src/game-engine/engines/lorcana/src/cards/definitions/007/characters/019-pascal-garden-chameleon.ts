import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const pascalGardenChameleon: LorcanaCharacterCardDefinition = {
  id: "a5o",
  name: "Pascal",
  title: "Garden Chameleon",
  characteristics: ["storyborn", "ally"],
  text: "Evasive",
  type: "character",
  abilities: [evasiveAbility],
  inkwell: false,
  // @ts-expect-error
  color: "",
  colors: ["amber", "amethyst"],
  cost: 4,
  strength: 3,
  willpower: 3,
  illustrator: "Aubrey Archer",
  number: 19,
  set: "007",
  rarity: "uncommon",
  lore: 3,
};
