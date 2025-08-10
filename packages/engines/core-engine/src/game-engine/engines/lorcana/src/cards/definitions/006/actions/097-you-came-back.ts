import { chosenCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const youCameBack: LorcanaActionCardDefinition = {
  id: "bl8",
  name: "You Came Back",
  characteristics: ["action"],
  text: "Ready chosen character.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Ready chosen character.",
      targets: [chosenCharacterTarget],
      effects: [{ type: "ready" }],
    },
  ],
  inkwell: false,
  colors: ["emerald"],
  cost: 3,
  illustrator: "Michaela Martin",
  number: 97,
  set: "006",
  rarity: "rare",
};
