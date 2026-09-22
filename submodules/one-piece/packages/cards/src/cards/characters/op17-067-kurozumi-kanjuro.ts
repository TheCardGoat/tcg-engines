import type { CharacterCard } from "@tcg/op-types";
import { op17KurozumiKanjuro067I18n } from "./op17-067-kurozumi-kanjuro.i18n.ts";

export const op17KurozumiKanjuro067: CharacterCard = {
  id: "OP17-067",
  canonicalId: "OP17-067",
  slug: "kurozumi-kanjuro/op17-067",
  name: "Kurozumi Kanjuro",
  printings: [
    {
      id: "OP17-067",
      artId: "OP17-067",
      setCode: "OP17",
      collectorNumber: "067",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-067_rJxiZQl.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP17",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Land of Wano Kurozumi Clan"],
  attribute: "slash",
  effect:
    "[On Play] DON!! -1: If you have a Character with a cost of 10 or more, rest up to 1 of your opponent's Characters.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
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
            },
            condition: {
              condition: "hasCard",
              player: "self",
              zone: "character",
              filters: [
                {
                  filter: "cost",
                  comparison: "gte",
                  value: 10,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op17KurozumiKanjuro067I18n,
};
