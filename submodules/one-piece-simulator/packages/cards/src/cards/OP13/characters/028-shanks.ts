import type { CharacterCard } from "@tcg/op-types";
import { op13Shanks028I18n } from "./028-shanks.i18n.ts";

export const op13Shanks028: CharacterCard = {
  id: "OP13-028",
  cardType: "character",
  color: ["green"],
  rarity: "SR",
  setId: "OP13",
  cost: 10,
  power: 12000,
  traits: ["FILM The Four Emperors Red-Haired Pirates"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-028_p1_rvGiRHX.jpg",
      imageId: "OP13-028_p1",
    },
  ],
  effect:
    "[On Play] Set all of your DON!! cards as active. Then, you cannot play cards from your hand during this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["costArea"],
              count: {
                amount: "all",
              },
            },
          },
          {
            action: "playRestriction",
            restriction: "cannotPlay",
            filters: [],
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op13Shanks028I18n,
};
