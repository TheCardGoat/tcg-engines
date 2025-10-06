import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const ryderFleetfootedInfiltrator: LorcanaCharacterCardDefinition = {
  id: "qio",
  name: "Ryder",
  title: "Fleet-Footed Infiltrator",
  characteristics: ["storyborn", "ally"],
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  type: "character",
  abilities: [evasiveAbility],
  inkwell: true,
  colors: ["amethyst"],
  cost: 4,
  strength: 3,
  willpower: 4,
  illustrator: "Lisanne Koelewijn",
  number: 56,
  set: "008",
  rarity: "super_rare",
  lore: 1,
};
