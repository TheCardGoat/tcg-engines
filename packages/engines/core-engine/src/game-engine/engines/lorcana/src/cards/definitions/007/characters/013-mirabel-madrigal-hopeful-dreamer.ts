import {
  evasiveAbility,
  singerAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mirabelMadrigalHopefulDreamer: LorcanaCharacterCardDefinition = {
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
