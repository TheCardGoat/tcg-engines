import { bodyguardAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/bodyguardAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const thePrinceChallengerOfTheRise: LorcanaCharacterCardDefinition = {
  id: "yba",
  name: "The Prince",
  title: "Vigilant Suitor",
  characteristics: ["storyborn", "hero", "prince"],
  text: "Bodyguard ",
  type: "character",
  abilities: [bodyguardAbility],
  inkwell: false,
  colors: ["amber"],
  cost: 2,
  strength: 0,
  willpower: 5,
  illustrator: "João Moura",
  number: 24,
  set: "007",
  rarity: "uncommon",
  lore: 1,
};
