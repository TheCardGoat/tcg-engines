import { challengerAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/challengerAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const elsaGlovesOff: LorcanaCharacterCardDefinition = {
  id: "dmk",
  reprints: ["b83"],
  name: "Elsa",
  title: "Gloves Off",
  characteristics: ["hero", "queen", "sorcerer", "storyborn"],
  text: "**Challenger** +3 _(While challenging, this character gets +3 {S})_",
  type: "character",
  abilities: [challengerAbility(3)],
  flavour:
    "The power of ice may not stop the flood, but it will help protect Lorcana.",
  inkwell: true,
  colors: ["amethyst"],
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  illustrator: "Cristian Romero",
  number: 39,
  set: "ROF",
  rarity: "common",
};
