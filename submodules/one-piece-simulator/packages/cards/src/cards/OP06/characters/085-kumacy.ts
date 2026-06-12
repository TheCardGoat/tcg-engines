import type { CharacterCard } from "@tcg/op-types";
import { op06Kumacy085I18n } from "./085-kumacy.i18n.ts";

export const op06Kumacy085: CharacterCard = {
  id: "OP06-085",
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
