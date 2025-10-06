import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/target";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const rapunzelSunshine: LorcanaCharacterCardDefinition = {
  id: "ngs",
  reprints: ["p6p"],
  name: "Rapunzel",
  title: "Sunshine",
  characteristics: ["hero", "dreamborn", "princess"],
  text: "**MAGIC HAIR** {E} − Remove up to 2 damage from chosen character.",
  type: "character",
  abilities: [
    {
      type: "activated",
      name: "Magic Hair",
      text: "{E} − Remove up to 2 damage from chosen character.",
      costs: [{ type: "exert" }],
      effects: [
        {
          type: "heal",
          amount: 2,
          target: chosenCharacter,
        },
      ],
    },
  ],
  flavour: "We can all make the world a little brighter in our own way.",
  inkwell: true,
  colors: ["amber"],
  cost: 2,
  strength: 1,
  willpower: 4,
  lore: 1,
  illustrator: "Aubrey Archer",
  number: 20,
  set: "ROF",
  rarity: "common",
};
