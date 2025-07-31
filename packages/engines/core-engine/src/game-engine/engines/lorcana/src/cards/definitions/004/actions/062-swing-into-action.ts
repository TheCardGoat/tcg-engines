import { chosenCharacterGainsRush } from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const swingIntoAction: LorcanaActionCardDefinition = {
  id: "bho",
  name: "Swing Into Action",
  characteristics: ["action"],
  text: "Chosen character gains **Rush** this turn. _(They can challenge the turn they're played.)_",
  type: "action",
  abilities: [
    {
      type: "resolution",
      effects: [chosenCharacterGainsRush],
    },
  ],
  inkwell: true,
  colors: ["amethyst"],
  cost: 1,
  illustrator: "Wouter Bruneel",
  number: 62,
  set: "URR",
  rarity: "common",
};
