import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const standOut: LorcanaActionCardDefinition = {
  id: "s55",
  missingTestCase: true,
  name: "Stand Out",
  characteristics: ["action", "song"],
  text: "(A character with cost 3 or more can {E} to sing this song for free.)\nChosen character gets +3 {S} and gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)",
  type: "action",
  inkwell: true,
  colors: ["emerald"],
  cost: 3,
  illustrator: "Raquel Villanueva",
  number: 94,
  set: "009",
  rarity: "uncommon",
  abilities: [
    {
      type: "resolution",
      text: "Chosen character gets +3 {S} and gains Evasive until the start of your next turn.",
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: 3,
          modifier: "add",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
            ],
          },
          duration: "next_turn",
          until: true,
        },
        {
          type: "ability",
          ability: "evasive",
          modifier: "add",
          duration: "next_turn",
          until: true,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
            ],
          },
        },
      ],
    },
  ],
};
