import { singerTogetherAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const stoppedChaosInItsTracks: LorcanaActionCardDefinition = {
  id: "cm3",
  name: "Stopped Chaos In Its Tracks",
  characteristics: ["action", "song"],
  text: "Sing Together 8\nReturn up to 2 chosen characters with 3 {S} or less each to their player's hand.",
  type: "action",
  inkwell: true,
  colors: ["emerald"],
  cost: 8,
  illustrator: "Edu Francisco",
  number: 115,
  set: "008",
  rarity: "uncommon",
  abilities: [
    singerTogetherAbility(8),
    {
      type: "resolution",
      effects: [
        {
          type: "move",
          to: "hand",
          target: {
            type: "card",
            value: 2,
            upTo: true,
            filters: [
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
              {
                filter: "attribute",
                value: "strength",
                comparison: { operator: "lte", value: 3 },
              },
            ],
          },
        },
      ],
    },
  ],
};
