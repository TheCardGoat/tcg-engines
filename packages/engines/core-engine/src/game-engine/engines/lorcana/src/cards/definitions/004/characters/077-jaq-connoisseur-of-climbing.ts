import { chosenOpposingCharacter } from "@lorcanito/lorcana-engine/abilities/target";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const jaqConnoisseurOfClimbing: LorcanitoCharacterCardDefinition = {
  id: "d8y",
  name: "Jaq",
  title: "Connoisseur of Climbing",
  characteristics: ["storyborn", "ally"],
  text: "**SNEAKY IDEA** When you play this character, chosen opposing character gains **Reckless** during their next turn. _(They can't quest and must challenge if able.)_",
  type: "character",
  abilities: [
    {
      type: "resolution",
      effects: [
        {
          type: "ability",
          ability: "reckless",
          modifier: "add",
          duration: "next_turn",
          target: chosenOpposingCharacter,
        },
      ],
    },
  ],
  flavour: "Teamwork makes the cheese work.",
  inkwell: true,
  colors: ["emerald"],
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 2,
  illustrator: "Maddie Shilt",
  number: 77,
  set: "URR",
  rarity: "common",
};
