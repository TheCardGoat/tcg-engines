import type { CharacterCard } from "@tcg/op-types";
import { op06Shanks007I18n } from "./007-shanks.i18n.ts";

export const op06Shanks007: CharacterCard = {
  id: "OP06-007",
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "OP06",
  cost: 10,
  power: 12000,
  traits: ["FILM The Four Emperors Red-Haired Pirates"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-007_p1.jpg",
      imageId: "OP06-007_p1",
    },
  ],
  effect: "[On play] K.O. up to 1 of your opponent's Characters with 10000 power or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "power",
                  comparison: "lte",
                  value: 10000,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op06Shanks007I18n,
};
