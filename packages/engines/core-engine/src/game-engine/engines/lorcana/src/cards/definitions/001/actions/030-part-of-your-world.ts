import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";

export const partOfYourWorld: LorcanitoActionCard = {
  id: "ztz",
  name: "Part of Your World",
  characteristics: ["action", "song"],
  text: "_(A character with cost 3 or more can {E} to sing this song\rfor free.)_\n Return a character card from your discard to your hand.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Part of Your World",
      text: "Return a character card from your discard to your hand.",
      effects: [
        {
          type: "move",
          to: "hand",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "owner", value: "self" },
              { filter: "type", value: "character" },
              { filter: "zone", value: "discard" },
            ],
          },
        },
      ],
    },
  ],
  flavour: "What would I give\nIf I could live out of these waters?",
  colors: ["amber"],
  cost: 3,
  illustrator: "Samanta Erdini",
  number: 30,
  set: "TFC",
  rarity: "rare",
};
