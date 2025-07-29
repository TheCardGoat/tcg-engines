import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";

export const theyNeverComeBack: LorcanitoActionCard = {
  id: "dtw",
  name: "They Never Come Back",
  characteristics: ["action"],
  text: "Up to 2 chosen characters can't ready at the start of their next turn. Draw a card.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      resolveEffectsIndividually: true,
      effects: [
        {
          type: "restriction",
          restriction: "ready-at-start-of-turn",
          duration: "next_turn",
          target: {
            type: "card",
            value: 2,
            upTo: true,
            filters: chosenCharacter.filters,
          },
        },
        drawACard,
      ],
    },
  ],
  inkwell: true,
  colors: ["amethyst"],
  cost: 3,
  illustrator: "Saulo Nate",
  number: 78,
  set: "008",
  rarity: "uncommon",
};
