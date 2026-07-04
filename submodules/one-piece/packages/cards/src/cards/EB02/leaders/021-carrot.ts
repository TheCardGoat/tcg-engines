import type { LeaderCard } from "@tcg/op-types";
import { eb02Carrot021I18n } from "./021-carrot.i18n.ts";

export const eb02Carrot021: LeaderCard = {
  id: "OP08-021",
  canonicalId: "OP08-021",
  slug: "carrot/op08-021",
  name: "Carrot",
  printings: [
    {
      id: "OP08-021",
      artId: "OP08-021",
      setCode: "EB02",
      collectorNumber: "021",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-021_bfZmE7y.jpg",
    },
  ],
  cardType: "leader",
  color: ["green"],
  rarity: "L",
  setId: "EB02",
  power: 5000,
  life: 5,
  traits: ["Minks"],
  attribute: "special",
  effect:
    '[Activate: Main] [Once Per Turn] If you have a "Minks" type Character, rest up to 1 of your opponent\'s Characters with a cost of 5 or less.',
  effects: {
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "hasCard",
            player: "self",
            zone: "character",
            filters: [
              {
                filter: "trait",
                value: "Minks",
              },
            ],
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
        oncePerTurn: true,
      },
    ],
  },
  i18n: eb02Carrot021I18n,
};
