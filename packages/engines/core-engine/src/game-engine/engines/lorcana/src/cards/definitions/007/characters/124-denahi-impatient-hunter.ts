import {
  recklessAbility,
  resistAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const denahiImpatientHunter: LorcanitoCharacterCardDefinition = {
  id: "lb2",
  name: "Denahi",
  title: "Impatient Hunter",
  characteristics: ["storyborn"],
  text: "Reckless\nResist +2",
  type: "character",
  abilities: [recklessAbility, resistAbility(2)],
  inkwell: true,
  colors: ["ruby", "steel"],
  cost: 3,
  strength: 3,
  willpower: 2,
  illustrator: "Brian Weisz",
  number: 124,
  set: "007",
  rarity: "uncommon",
  lore: 0,
};
