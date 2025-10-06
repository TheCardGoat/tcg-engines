import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { whenYourOtherCharactersIsBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";

export const emeraldChromiconItem: LorcanaItemCardDefinition = {
  id: "ewm",
  name: "Emerald Chromicon",
  characteristics: ["item"],
  text: "**EMERALD LIGHT** During opponents’ turns, whenever one of your characters is banished, you may return chosen character to their player’s hand.",
  type: "item",
  abilities: [
    whenYourOtherCharactersIsBanished({
      name: "Emerald Light",
      text: "During opponents’ turns, whenever one of your characters is banished, you may return chosen character to their player’s hand.",
      optional: true,
      conditions: [
        {
          type: "during-turn",
          value: "opponent",
        },
      ],
      effects: [
        {
          type: "move",
          to: "hand",
          target: chosenCharacter,
        },
      ],
    }),
  ],
  flavour: "Trust in the winds of change.\n–Inscription",
  colors: ["emerald"],
  cost: 3,
  illustrator: "Dustin Panzino",
  number: 100,
  set: "SSK",
  rarity: "uncommon",
};
