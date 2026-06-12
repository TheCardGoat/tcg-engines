import type { CharacterCard } from "@tcg/op-types";
import { prb02ShanksSt16004Reprint004I18n } from "./004-shanks-st16-004-reprint.i18n.ts";

export const prb02ShanksSt16004Reprint004: CharacterCard = {
  id: "ST16-004",
  cardType: "character",
  color: ["green"],
  rarity: "SR",
  setId: "PRB02",
  cost: 9,
  power: 11000,
  traits: ["FILM The Four Emperors Red-Haired Pirates"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST16-004_p2.jpg",
      imageId: "ST16-004_p2",
    },
  ],
  effect:
    '[On Play] K.O. up to 1 of your opponent\'s rested Characters.Disclaimer: This card was reprinted from the original set with changes to the copyright information (Note: the original print did not include "EN" at the end of the copyright).',
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
                  filter: "state",
                  value: "rested",
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: prb02ShanksSt16004Reprint004I18n,
};
