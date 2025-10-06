import { voicelessAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/voicelessAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const arielOnHumanLegs: LorcanaCharacterCardDefinition = {
  id: "d6b",
  name: "Ariel",
  title: "On Human Legs",
  characteristics: ["hero", "storyborn", "princess"],
  text: "**VOICELESS** This character can't {E} to sing songs.",
  type: "character",
  abilities: [voicelessAbility],
  flavour: '". . ."',
  inkwell: true,
  colors: ["amber"],
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  illustrator: "Matthew Robert Davies",
  number: 1,
  set: "TFC",
  rarity: "uncommon",
};
