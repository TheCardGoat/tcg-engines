import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const breakAction: LorcanaActionCardDefinition = {
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
