import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";

export const healingDecanterItem: LorcanaItemCardDefinition = {
  id: "t6p",
  missingTestCase: true,
  name: "Healing Decanter",
  characteristics: ["item"],
  text: "**RENEWING ESSENCE** {E} – Remove up to 2 damage from chosen character.",
  type: "item",
  abilities: [
    {
      type: "activated",
      costs: [{ type: "exert" }],
      name: "RENEWING ESSENCE",
      text: "{E} – Remove up to 2 damage from chosen character.",
      effects: [
        {
          type: "heal",
          amount: 2,
          target: chosenCharacter,
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 2,
  illustrator: "Alex Accorsi",
  number: 30,
  set: "SSK",
  rarity: "common",
};
