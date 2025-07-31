import { chosenItem } from "@lorcanito/lorcana-engine/abilities/targets";
import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const heWhoStealsAndRunsAway: LorcanaActionCardDefinition = {
  id: "s8j",
  name: "He Who Steals And Runs Away",
  characteristics: ["action"],
  text: "Banish chosen item. Draw a card.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      resolveEffectsIndividually: true,
      effects: [
        {
          type: "banish",
          target: chosenItem,
        },
        drawACard,
      ],
    },
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 3,
  illustrator: "Luis Huerta",
  number: 114,
  set: "008",
  rarity: "common",
};
