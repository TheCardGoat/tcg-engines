import { putCardEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenItemOrLocationTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const hideAway: LorcanaActionCardDefinition = {
  id: "cyn",
  missingTestCase: true,
  name: "Hide Away",
  characteristics: ["action"],
  text: "Put chosen item or location into its player's inkwell facedown and exerted.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Put chosen item or location into its player's inkwell facedown and exerted.",
      targets: [chosenItemOrLocationTarget],
      effects: [
        putCardEffect({
          to: "inkwell",
          from: "play",
        }),
      ],
    },
  ],
  flavour:
    'Fauna: "Oh my! We dropped some . . ."\nMerryweather: "You mean you dropped some!"',
  inkwell: true,
  colors: ["sapphire"],
  cost: 2,
  illustrator: "Mike Parker",
  number: 163,
  set: "SSK",
  rarity: "uncommon",
};
