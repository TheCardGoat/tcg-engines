import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";

export const breakAction: LorcanitoActionCard = {
  id: "whn",
  name: "Break",
  characteristics: ["action"],
  text: "Banish chosen item.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      effects: [
        {
          type: "banish",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: ["item"] },
              { filter: "zone", value: "play" },
            ],
          },
        },
      ],
    },
  ],
  flavour: "No one throws a tantrum like a beast.",
  inkwell: true,
  colors: ["steel"],
  cost: 2,
  illustrator: "Grace Tran",
  number: 196,
  set: "TFC",
  rarity: "common",
};
