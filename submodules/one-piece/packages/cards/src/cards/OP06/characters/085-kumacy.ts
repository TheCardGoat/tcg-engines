import type { CharacterCard } from "@tcg/op-types";
import { op06Kumacy085I18n } from "./085-kumacy.i18n.ts";

export const op06Kumacy085: CharacterCard = {
  id: "OP06-085",
  canonicalId: "OP06-085",
  slug: "kumacy/op06-085",
  name: "Kumacy",
  printings: [
    {
      id: "OP06-085",
      artId: "OP06-085",
      setCode: "OP06",
      collectorNumber: "085",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-085.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP06",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Thriller Bark Pirates"],
  attribute: "strike",
  effect: "[DON!! x2][Your Turn] This Character gains +1000 power for every 5 cards in your trash.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 2,
          },
          {
            condition: "turn",
            value: "your",
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
  i18n: op06Kumacy085I18n,
};
