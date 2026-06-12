import type { CharacterCard } from "@tcg/op-types";
import { op04Yamato112I18n } from "./112-yamato.i18n.ts";

export const op04Yamato112: CharacterCard = {
  id: "OP04-112",
  cardType: "character",
  color: ["yellow"],
  rarity: "SR",
  setId: "OP04",
  cost: 9,
  power: 9000,
  traits: ["Land of Wano"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-112_p1.jpg",
      imageId: "OP04-112_p1",
    },
  ],
  effect:
    "[On Play] K.O. up to 1 of your opponent's Characters with a cost equal to or less than the total of your and your opponent's Life cards. Then, if you have 1 or less Life cards, add up to 1 card from the top of your deck to the top of your Life cards.",
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
                  filter: "dynamicCost",
                  comparison: "lte",
                  source: "totalLifeCount",
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op04Yamato112I18n,
};
