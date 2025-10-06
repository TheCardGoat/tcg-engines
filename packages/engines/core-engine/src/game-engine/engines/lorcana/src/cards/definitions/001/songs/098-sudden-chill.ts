import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const suddenChill: LorcanaActionCardDefinition = {
  id: "pz4",
  reprints: ["f3l"],
  name: "Sudden Chill",
  characteristics: ["action", "song"],
  text: "Each opponent chooses and discards a card.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Sudden Chill",
      text: "Each opponent chooses and discards a card.",
      optional: false,
      responder: "opponent",
      effects: [
        {
          type: "discard",
          amount: 1,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "zone", value: "hand" },
              { filter: "owner", value: "self" },
            ],
          },
        },
      ],
    },
  ],
  flavour:
    "Cruella De Vil, Cruella De Vil \nIf she doesn't scare you, no evil thing will",
  inkwell: true,
  colors: ["emerald"],
  cost: 2,
  illustrator: "Giulia Riva",
  number: 98,
  set: "TFC",
  rarity: "common",
};
