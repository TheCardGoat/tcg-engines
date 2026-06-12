import type { CharacterCard } from "@tcg/op-types";
import { op13SilversRayleigh066I18n } from "./066-silvers-rayleigh.i18n.ts";

export const op13SilversRayleigh066: CharacterCard = {
  id: "OP13-066",
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "OP13",
  cost: 8,
  power: 9000,
  traits: ["Roger Pirates"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-066_p1_YADp4US.jpg",
      imageId: "OP13-066_p1",
    },
  ],
  effect:
    "[Rush]\n[On Play] If you have any DON!! cards given, rest up to 1 of your opponent's Characters with a cost of 5 or less. Then, add up to 1 DON!! card from your DON!! deck and set it as active at the end of this turn.",
  effects: {
    keywords: ["rush"],
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "donGiven",
            player: "self",
          },
        ],
        actions: [
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 5,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op13SilversRayleigh066I18n,
};
