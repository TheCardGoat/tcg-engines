import type { CharacterCard } from "@tcg/op-types";
import { op07Stussy085I18n } from "./085-stussy.i18n.ts";

export const op07Stussy085: CharacterCard = {
  id: "OP07-085",
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "OP07",
  cost: 9,
  power: 9000,
  traits: ["CP0"],
  attribute: "special",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-085_p1.jpg",
      imageId: "OP07-085_p1",
    },
  ],
  effect:
    "[On Play]You may trash 1 of your Characters: K.O. up to 1 of your opponent's Characters.",
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
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op07Stussy085I18n,
};
