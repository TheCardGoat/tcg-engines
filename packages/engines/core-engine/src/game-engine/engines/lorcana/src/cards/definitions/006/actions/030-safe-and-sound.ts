import { UNTIL_START_OF_YOUR_NEXT_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import { restrictEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenCharacterOfYoursTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const safeAndSound: LorcanaActionCardDefinition = {
  id: "ypf",
  name: "Safe And Sound",
  characteristics: ["action"],
  text: "Chosen character of yours can't be challenged until the start of your next turn.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Chosen character of yours can't be challenged until the start of your next turn.",
      targets: [chosenCharacterOfYoursTarget],
      effects: [
        restrictEffect({
          targets: [chosenCharacterOfYoursTarget],
          restriction: "challengeable",
          duration: UNTIL_START_OF_YOUR_NEXT_TURN,
        }),
      ],
    },
  ],
  inkwell: false,
  colors: ["amber"],
  cost: 2,
  illustrator: "Simone Tentoni",
  number: 30,
  set: "006",
  rarity: "rare",
};
