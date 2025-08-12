import { putCardEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { upToTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const allIsFound: LorcanaActionCardDefinition = {
  id: "prl",
  name: "All Is Found",
  characteristics: ["song", "action"],
  text: "Put up to 2 cards from your discard into your inkwell, facedown and exerted.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Put up to 2 cards from your discard into your inkwell, facedown and exerted.",
      effects: [
        putCardEffect({
          to: "inkwell",
          from: "discard",
          targets: upToTarget({
            target: {
              type: "card",
              zone: "discard",
              count: 1,
            },
            upTo: 2,
          }),
        }),
      ],
    },
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 5,
  illustrator: "Kiyaa Jaspri",
  number: 178,
  set: "007",
  rarity: "rare",
};
