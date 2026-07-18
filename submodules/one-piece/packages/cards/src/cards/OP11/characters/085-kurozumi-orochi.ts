import type { CharacterCard } from "@tcg/op-types";
import { op11KurozumiOrochi085I18n } from "./085-kurozumi-orochi.i18n.ts";

export const op11KurozumiOrochi085: CharacterCard = {
  id: "OP11-085",
  canonicalId: "OP11-085",
  slug: "kurozumi-orochi/op11-085",
  name: "Kurozumi Orochi",
  printings: [
    {
      id: "OP11-085",
      artId: "OP11-085",
      setCode: "OP11",
      collectorNumber: "085",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-085.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP11",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Land of Wano Kurozumi Clan"],
  attribute: "wisdom",
  effect:
    '[On Play] Add up to 1 "SMILE" type card with a cost of 5 or less from your trash to your hand.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "self",
              zones: ["trash"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "SMILE",
                  match: "includes",
                },
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
  i18n: op11KurozumiOrochi085I18n,
};
