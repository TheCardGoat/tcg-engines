import {
  bodyguardAbility,
  resistAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const thePrinceNeverGivesUp: LorcanaCharacterCardDefinition = {
  id: "g5k",

  name: "The Prince",
  title: "Never Gives Up",
  characteristics: ["hero", "dreamborn", "prince"],
  text: "**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_\n\n**Resist** +1 _(Damage dealt to this character is reduced by 1.)_",
  type: "character",
  abilities: [bodyguardAbility, resistAbility(1)],
  inkwell: true,
  colors: ["steel"],
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 2,
  illustrator: "Eri Welli",
  number: 195,
  set: "ROF",
  rarity: "uncommon",
};
