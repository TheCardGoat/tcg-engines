import { putCardEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenCharacterOfYoursTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const allFunnedOut: LorcanaActionCardDefinition = {
  id: "q4i",
  missingTestCase: true,
  name: "All Funned Out",
  characteristics: ["action"],
  text: "Put chosen character of yours into your inkwell facedown and exerted.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Put chosen character of yours into your inkwell facedown and exerted.",
      targets: [chosenCharacterOfYoursTarget],
      effects: [
        putCardEffect({
          to: "inkwell",
          from: "play",
        }),
      ],
    },
  ],
  flavour: "Pretty pathetic, huh?",
  inkwell: true,
  colors: ["sapphire"],
  cost: 1,
  illustrator: "Adam Ford",
  number: 164,
  set: "SSK",
  rarity: "uncommon",
};
