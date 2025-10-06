import { self } from "@lorcanito/lorcana-engine/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const pascalInquisitivePet: LorcanaCharacterCardDefinition = {
  id: "smc",
  name: "Pascal",
  title: "Inquisitive Pet",
  characteristics: ["storyborn", "ally"],
  text: "**COLORFUL TACTICS** When you play this character, look at the top 3 cards of your deck and put them back in any order.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "Colorful Tactics",
      text: "When you play this character, look at the top 3 cards of your deck and put them back in any order.",
      effects: [
        {
          type: "scry",
          amount: 3,
          mode: "top",
          target: self,
          limits: {
            bottom: 0,
            top: 3,
            hand: 0,
            inkwell: 0,
          },
        },
      ],
    },
  ],
  flavour:
    "If you want to find something hidden, get someone who's an expert at hiding.",
  inkwell: true,
  colors: ["sapphire"],
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  illustrator: "Noukah",
  number: 151,
  set: "URR",
  rarity: "common",
};
