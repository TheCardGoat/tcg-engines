import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const merlinsCarpetbag: LorcanaItemCardDefinition = {
  id: "izc",
  missingTestCase: true,
  name: "Merlin's Carpetbag",
  characteristics: ["item"],
  text: "**Hockety Pockety**{E}, 1 {I} – Return an item card from your discard to your hand.",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "Hockety Pockety",
      text: "{E}, 1 {I} – Return an item card from your discard to your hand.",
      costs: [{ type: "exert" }, { type: "ink", amount: 1 }],
      effects: [
        {
          type: "move",
          to: "hand",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "item" },
              { filter: "zone", value: "discard" },
              { filter: "owner", value: "self" },
            ],
          },
        },
      ],
    },
  ],
  flavour: "What a way to pack!\n–Arthur",
  colors: ["sapphire"],
  cost: 5,
  illustrator: "Gaku Kumatori",
  number: 167,
  set: "SSK",
  rarity: "uncommon",
};
