import {
  evasiveAbility,
  singerAbility,
} from "@lorcanito/lorcana-engine/abilities/abilities";
import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";

export const mirabelMadrigalHopefulDreamer: LorcanitoCharacterCard = {
  id: "lfp",
  name: "Mirabel Madrigal",
  title: "Hopeful Dreamer",
  characteristics: ["storyborn", "hero", "madrigal"],
  text: "Evasive\nSinger 5",
  type: "character",
  abilities: [evasiveAbility, singerAbility(5)],
  inkwell: true,
  // @ts-expect-error
  color: "",
  colors: ["amethyst", "amber"],
  cost: 3,
  strength: 1,
  willpower: 3,
  illustrator: "Xoni",
  number: 13,
  set: "007",
  rarity: "uncommon",
  lore: 1,
};
