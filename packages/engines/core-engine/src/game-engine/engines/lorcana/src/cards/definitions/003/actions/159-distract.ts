import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";

export const distract: LorcanitoActionCard = {
  id: "hb0",
  name: "Distract",
  characteristics: ["action"],
  text: "Chosen character gets -2 {S} this turn. Draw a card.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Distract",
      text: "Chosen character gets -2 {S} this turn. Draw a card.",
      resolveEffectsIndividually: true,
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: 2,
          modifier: "subtract",
          duration: "turn",
          until: true,
          target: chosenCharacter,
        },
        drawACard,
      ],
    },
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 2,
  illustrator: "Giuseppe de Maio",
  number: 159,
  set: "ITI",
  rarity: "common",
};
