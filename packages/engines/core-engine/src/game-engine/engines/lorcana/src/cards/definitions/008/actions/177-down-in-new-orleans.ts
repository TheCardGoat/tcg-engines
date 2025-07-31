import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const downInNewOrleans: LorcanaActionCardDefinition = {
  id: "py1",
  name: "Down In New Orleans",
  characteristics: ["action", "song"],
  text: "Look at the top 3 cards of your deck. You may reveal a character, item, or location card with cost 6 or less and play it for free. Put the rest on the bottom of your deck in any order.",
  type: "action",
  inkwell: false,
  colors: ["sapphire"],
  cost: 6,
  illustrator: "Robin Chung",
  number: 177,
  set: "008",
  rarity: "super_rare",
  abilities: [
    {
      type: "static",
      text: "Look at the top 3 cards of your deck. You may reveal a character, item, or location card with cost 6 or less and play it for free. Put the rest on the bottom of your deck in any order.",
      effects: [
        {
          type: "scry",
          parameters: {
            lookAt: 3,
            destinations: [
              {
                zone: "hand",
                count: 1,
                filter: {
                  cardType: ["character", "item", "location"],
                  cost: { max: 6 },
                },
                reveal: true,
              },
              {
                zone: "deck",
                position: "bottom",
                remainder: true,
                order: "any",
              },
            ],
          },
        },
      ],
    },
  ],
};
