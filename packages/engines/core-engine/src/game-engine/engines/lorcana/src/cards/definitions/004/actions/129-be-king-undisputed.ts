import { banishEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const beKingUndisputed: LorcanaActionCardDefinition = {
  id: "o8o",
  name: "Be King Undisputed",
  characteristics: ["action", "song"],
  text: "Each opponent chooses and banishes one of their characters.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Each opponent chooses and banishes one of their characters.",
      responder: "opponent",
      effects: [
        banishEffect({
          targets: [
            {
              type: "card",
              cardType: "character",
              owner: "self",
              count: 1,
            },
          ],
        }),
      ],
    },
  ],
  flavour: "Respected, saluted",
  colors: ["ruby"],
  cost: 4,
  illustrator: "Emily Abeydeera",
  number: 129,
  set: "URR",
  rarity: "rare",
};
