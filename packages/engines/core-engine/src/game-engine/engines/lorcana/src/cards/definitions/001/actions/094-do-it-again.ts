import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";

export const doItAgain: LorcanitoActionCard = {
  id: "yld",
  name: "Do It Again!",
  characteristics: ["action"],
  text: "Return an action card from your discard to your hand.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Do It Again!",
      text: "Return an action card from your discard to your hand.",
      effects: [
        {
          type: "move",
          to: "hand",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "owner", value: "self" },
              { filter: "type", value: ["action"] },
              { filter: "zone", value: "discard" },
            ],
          },
        },
      ],
    },
  ],
  flavour:
    ". . . Then scrub the terrace, sweep the halls and the stairs, clean the chimneys. And of course there's the mending, and the sewing, and the laundry . . . −Lady Tremaine",
  colors: ["emerald"],
  cost: 3,
  illustrator: "Ellie Horie",
  number: 94,
  set: "TFC",
  rarity: "rare",
};
