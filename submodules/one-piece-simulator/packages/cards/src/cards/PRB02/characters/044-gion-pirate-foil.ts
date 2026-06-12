import type { CharacterCard } from "@tcg/op-types";
import { prb02GionPirateFoil044I18n } from "./044-gion-pirate-foil.i18n.ts";

export const prb02GionPirateFoil044: CharacterCard = {
  id: "OP06-044",
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "PRB02",
  cost: 4,
  power: 5000,
  counter: 2000,
  traits: ["Navy"],
  attribute: "slash",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-044_r1.jpg",
      imageId: "OP06-044_r1",
    },
  ],
  effect:
    "[Your Turn][Once Per Turn] When your opponent activates an Event, your opponent must place 1 card from their hand at the bottom of their deck.",
  effects: {
    effects: [
      {
        trigger: "whenOpponentActivatesEvent",
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
        ],
        actions: [
          {
            action: "returnToDeck",
            target: {
              player: "opponent",
              zones: ["hand"],
              count: {
                amount: 1,
              },
            },
            position: "bottom",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: prb02GionPirateFoil044I18n,
};
