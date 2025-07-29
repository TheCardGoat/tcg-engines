import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";

export const lastStand: LorcanitoActionCard = {
  id: "yh3",

  name: "Last Stand",
  characteristics: ["action"],
  text: "Banish chosen character who was challenged this turn.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      text: "Banish chosen character who was challenged this turn.",
      effects: [
        {
          type: "banish",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "zone", value: "play" },
              { filter: "type", value: "character" },
              { filter: "was-challenged" },
            ],
          },
        },
      ],
    },
  ],
  flavour: "Let's finish this, binturi.\n–Namaari",
  colors: ["amber"],
  cost: 2,
  illustrator: "Aisha Durmagambetova",
  number: 29,
  set: "ROF",
  rarity: "uncommon",
};
