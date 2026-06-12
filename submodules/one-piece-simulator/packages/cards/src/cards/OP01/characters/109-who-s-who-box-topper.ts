import type { CharacterCard } from "@tcg/op-types";
import { op01WhoSWhoBoxTopper109I18n } from "./109-who-s-who-box-topper.i18n.ts";

export const op01WhoSWhoBoxTopper109: CharacterCard = {
  id: "OP01-109",
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP01",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Animal Kingdom Pirates"],
  attribute: "slash",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-109.jpg",
      imageId: "OP01-109",
    },
  ],
  effect:
    "[DON!! x1] [Your Turn] If you have 8 or more DON!! cards on your field, this Character gains +1000 power.",
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
          {
            condition: "donFieldCount",
            player: "self",
            comparison: "gte",
            value: 8,
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 1000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op01WhoSWhoBoxTopper109I18n,
};
