import {
  recklessAbility,
  rushAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const herculesDaringDemigod: LorcanaCharacterCardDefinition = {
  id: "fk3",
  name: "Hercules",
  title: "Daring Demigod",
  characteristics: ["hero", "dreamborn", "prince"],
  text: "**Rush** _(This character can challenge the turn they're played.)_\n\n\n**Reckless** _(This character can't quest and must challenge each turn if able.)_",
  type: "character",
  abilities: [rushAbility, recklessAbility],
  inkwell: true,
  colors: ["ruby"],
  cost: 5,
  strength: 7,
  willpower: 3,
  lore: 0,
  illustrator: "Diogo Saito",
  number: 109,
  set: "URR",
  rarity: "uncommon",
};
