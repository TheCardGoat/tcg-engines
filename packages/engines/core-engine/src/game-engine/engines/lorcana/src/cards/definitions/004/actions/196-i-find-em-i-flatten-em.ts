import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";

export const iFindEmIFlattenEm: LorcanitoActionCard = {
  id: "h30",
  name: "I Find 'Em, I Flatten 'Em",
  characteristics: ["action", "song"],
  text: "_(A character with cost 4 or more can {E} to sing this song for free.)_\n\n\nBanish all items.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      effects: [
        {
          type: "banish",
          target: {
            type: "card",
            value: "all",
            filters: [
              { filter: "zone", value: "play" },
              { filter: "type", value: "item" },
            ],
          },
        },
      ],
    },
  ],
  flavour:
    "All the most difficult missions are for me, because I am indestructible.",
  inkwell: true,
  colors: ["steel"],
  cost: 4,
  illustrator: "Jennifer Park",
  number: 196,
  set: "URR",
  rarity: "uncommon",
};
