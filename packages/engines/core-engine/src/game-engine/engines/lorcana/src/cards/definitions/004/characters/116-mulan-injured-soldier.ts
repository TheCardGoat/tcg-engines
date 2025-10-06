import { thisCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mulanInjuredSoldier: LorcanaCharacterCardDefinition = {
  id: "kry",
  reprints: ["jmn"],
  name: "Mulan",
  title: "Injured Soldier",
  characteristics: ["hero", "storyborn", "princess"],
  text: "**BLESSURE AU COMBAT** This character enters play with 2 damage.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "Blessure au Combat",
      text: "This character enters play with 2 damage.",
      effects: [
        {
          type: "damage",
          amount: 2,
          target: thisCharacter,
        },
      ],
    },
  ],
  flavour: "She'll never give up.",
  inkwell: true,
  colors: ["ruby"],
  cost: 1,
  strength: 2,
  willpower: 3,
  lore: 1,
  illustrator: "Jared Mathews",
  number: 116,
  set: "URR",
  rarity: "common",
};
