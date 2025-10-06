import { chosenCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const iceBlock: LorcanaItemCardDefinition = {
  id: "i2i",
  missingTestCase: true,
  name: "Ice Block",
  characteristics: ["item"],
  text: "**CHILLY LABOR** {E} − Chosen character gets -1 {S} this turn.",
  type: "item",
  abilities: [
    {
      type: "activated",
      costs: [{ type: "exert" }],
      name: "Chilly Labor",
      text: "{E} − Chosen character gets -1 {S} this turn.",
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: 1,
          modifier: "subtract",
          target: chosenCharacter,
        },
      ],
    },
  ],
  flavour: "Frozen ink can be harvested and processed to many useful ends.",
  colors: ["sapphire"],
  cost: 1,
  illustrator: "Gregor Krysinski",
  number: 168,
  set: "URR",
  rarity: "common",
};
