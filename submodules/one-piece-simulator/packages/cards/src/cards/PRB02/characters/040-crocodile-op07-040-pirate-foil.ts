import type { CharacterCard } from "@tcg/op-types";
import { prb02CrocodileOp07040PirateFoil040I18n } from "./040-crocodile-op07-040-pirate-foil.i18n.ts";

export const prb02CrocodileOp07040PirateFoil040: CharacterCard = {
  id: "OP07-040",
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "PRB02",
  cost: 4,
  power: 5000,
  counter: 2000,
  traits: ["Baroque Works The Seven Warlords of the Sea"],
  attribute: "special",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-040_r1.jpg",
      imageId: "OP07-040_r1",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-040_p3.jpg",
      imageId: "OP07-040_p3",
    },
  ],
  effect:
    "[On Play] (1) (You may rest the specified number of DON!! cards in your cost area.): Return up to 1 Character with a cost of 2 or less to the owner's hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "restDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 2,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: prb02CrocodileOp07040PirateFoil040I18n,
};
