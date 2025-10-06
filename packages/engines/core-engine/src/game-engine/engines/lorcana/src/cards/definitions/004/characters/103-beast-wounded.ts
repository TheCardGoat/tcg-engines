import { thisCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const beastWounded: LorcanaCharacterCardDefinition = {
  id: "jrk",
  name: "Beast",
  title: "Wounded",
  characteristics: ["hero", "storyborn", "prince"],
  text: "**THAT HURTS!** This character enters play with 4 damage.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "THAT HURTS!",
      text: "This character enters play with 4 damage.",
      effects: [
        {
          type: "damage",
          amount: 4,
          target: thisCharacter,
        },
      ],
    },
  ],
  flavour:
    "It wasn't the severity of the wounds but the sickly substance that caused such unbearable pain.",
  inkwell: true,
  colors: ["ruby"],
  cost: 3,
  strength: 2,
  willpower: 6,
  lore: 2,
  illustrator: "Ian MacDonald",
  number: 103,
  set: "URR",
  rarity: "uncommon",
};
