import { bodyguardAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/bodyguardAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const chienPoImperialSoldier: LorcanaCharacterCardDefinition = {
  id: "ml5",
  name: "Chien-Po",
  title: "Imperial Soldier",
  characteristics: ["storyborn", "ally"],
  text: "**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must chose one with Bodyguard if able.)_",
  type: "character",
  abilities: [bodyguardAbility],
  inkwell: true,
  colors: ["steel"],
  cost: 5,
  strength: 4,
  willpower: 7,
  lore: 1,
  illustrator: "Michela Cacciatore / Giulia Priori",
  number: 178,
  set: "URR",
  rarity: "common",
};
