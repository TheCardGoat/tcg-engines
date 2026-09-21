import type { CharacterCard } from "@tcg/op-types";
import { op15HodyJones033I18n } from "./op15-033-hody-jones.i18n.ts";

export const op15HodyJones033: CharacterCard = {
  id: "OP15-033",
  canonicalId: "OP15-033",
  slug: "hody-jones/op15-033",
  name: "Hody Jones",
  printings: [
    {
      id: "OP15-033",
      artId: "OP15-033",
      setCode: "OP15",
      collectorNumber: "033",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-033_WxHehHq.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP15",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Fish-Man New Fish-Man Pirates Fish-Man Island"],
  attribute: "strike",
  effect:
    "[On Play] Set your {Fish-Man} type Leader as active. Then, add 1 card from the top of your Life cards to your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Fish-Man",
                  match: "includes",
                },
              ],
            },
          },
          {
            action: "removeFromLife",
            player: "self",
            count: {
              amount: 1,
            },
            destination: "hand",
            position: "top",
          },
        ],
      },
    ],
  },
  i18n: op15HodyJones033I18n,
};
