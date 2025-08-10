import { UNTIL_START_OF_YOUR_NEXT_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import { yourCharactersTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const restoringAtlantis: LorcanaActionCardDefinition = {
  id: "m7i",
  name: "Restoring Atlantis",
  characteristics: ["action"],
  text: "Your characters can't be challenged until the start of your next turn.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Your characters can't be challenged until the start of your next turn.",
      targets: [yourCharactersTarget],
      effects: [
        {
          type: "restrict",
          restriction: "challengeable",
          duration: UNTIL_START_OF_YOUR_NEXT_TURN,
        },
      ],
    },
  ],
  inkwell: false,
  colors: ["steel"],
  cost: 5,
  illustrator: "Ricardo Gacia",
  number: 201,
  set: "007",
  rarity: "rare",
};
