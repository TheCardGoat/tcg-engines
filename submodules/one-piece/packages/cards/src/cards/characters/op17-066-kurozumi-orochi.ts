import type { CharacterCard } from "@tcg/op-types";
import { op17KurozumiOrochi066I18n } from "./op17-066-kurozumi-orochi.i18n.ts";

export const op17KurozumiOrochi066: CharacterCard = {
  id: "OP17-066",
  canonicalId: "OP17-066",
  slug: "kurozumi-orochi/op17-066",
  name: "Kurozumi Orochi",
  printings: [
    {
      id: "OP17-066",
      artId: "OP17-066",
      setCode: "OP17",
      collectorNumber: "066",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-066_2GBugGE.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP17",
  cost: 1,
  power: 0,
  counter: 1000,
  traits: ["Land of Wano Kurozumi Clan"],
  attribute: "wisdom",
  effect:
    "[On Play] DON!! -1: If you have a Character with a cost of 10 or more, draw 2 cards and trash 1 card from your hand.",
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
            action: "conditional",
            predicate: {
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
            whenTrue: [
              {
                action: "draw",
                player: "self",
                amount: 2,
              },
              {
                action: "trashFromHand",
                player: "self",
                amount: 1,
              },
            ],
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op17KurozumiOrochi066I18n,
};
