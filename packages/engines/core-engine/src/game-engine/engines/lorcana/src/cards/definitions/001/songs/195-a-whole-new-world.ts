import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const aWholeNewWorld: LorcanaActionCardDefinition = {
  id: "u8m",
  name: "A Whole New World",
  characteristics: ["action", "song"],
  text: "_(A character with cost 5 or more can {E} to sing this\nsong for free.)_\nEach player discards their hand and draws 7 cards.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "A Whole New World",
      text: "Each player discards their hand and draws 7 cards.",
      effects: [
        {
          type: "discard",
          amount: 60,
          target: {
            type: "card",
            value: "all",
            filters: [{ filter: "zone", value: "hand" }],
          },
        },
        {
          type: "draw",
          amount: 7,
          target: {
            type: "player",
            value: "all",
          },
        },
      ],
    },
  ],
  flavour: "Shining, shimmering, splendid . . .",
  colors: ["steel"],
  cost: 5,
  illustrator: "Koni",
  number: 195,
  set: "TFC",
  rarity: "super_rare",
};
