import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const repair: LorcanaActionCardDefinition = {
  id: "wr7",
  missingTestCase: true,
  name: "Repair",
  characteristics: ["action"],
  text: "Remove up to 3 damage from one of your locations or characters.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      effects: [
        {
          type: "heal",
          amount: 3,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: ["location", "character"] },
              { filter: "zone", value: "play" },
              { filter: "owner", value: "self" },
            ],
          },
        },
      ],
    },
  ],
  flavour: "I'm thinkin' about opening a shop here. What do you think?",
  inkwell: true,
  colors: ["sapphire"],
  cost: 2,
  illustrator: "Denny Minonne",
  number: 162,
  set: "ITI",
  rarity: "common",
};
