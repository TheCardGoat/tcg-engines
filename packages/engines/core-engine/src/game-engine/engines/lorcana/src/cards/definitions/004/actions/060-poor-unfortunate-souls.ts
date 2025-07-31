import { withCostXorLess } from "@lorcanito/lorcana-engine/abilities/targets";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const poorUnfortunateSouls: LorcanaActionCardDefinition = {
  id: "d2i",
  missingTestCase: false,
  name: "Poor Unfortunate Souls",
  characteristics: ["action", "song"],
  text: "_(A character with cost 2 or more can {E} to sing this song for free.)_\n\n\nReturn a character, item or location with cost 2 or less to their player's hand.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      effects: [
        {
          type: "move",
          to: "hand",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: ["character", "location", "item"] },
              { filter: "zone", value: "play" },
              withCostXorLess(2),
            ],
          },
        },
      ],
    },
  ],
  flavour: "It's sad but true",
  inkwell: true,
  colors: ["amethyst"],
  cost: 2,
  illustrator: "Denny Minonne",
  number: 60,
  set: "URR",
  rarity: "common",
};
