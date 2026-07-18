import type { CharacterCard } from "@tcg/op-types";
import { op08Sheepshead083I18n } from "./083-sheepshead.i18n.ts";

export const op08Sheepshead083: CharacterCard = {
  id: "OP08-083",
  canonicalId: "OP08-083",
  slug: "sheepshead",
  name: "Sheepshead",
  printings: [
    {
      id: "OP08-083",
      artId: "OP08-083",
      setCode: "OP08",
      collectorNumber: "083",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-083.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP08",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Animal Kingdom Pirates SMILE"],
  attribute: "slash",
  effect: "[DON!! x1] [Your Turn] Give all of your opponent's Characters −1 cost.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
          {
            condition: "turn",
            value: "your",
          },
        ],
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: "all",
              },
            },
            value: -1,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op08Sheepshead083I18n,
};
