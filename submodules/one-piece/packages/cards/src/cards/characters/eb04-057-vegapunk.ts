import type { CharacterCard } from "@tcg/op-types";
import { eb04Vegapunk057I18n } from "./eb04-057-vegapunk.i18n.ts";

export const eb04Vegapunk057: CharacterCard = {
  id: "EB04-057",
  canonicalId: "EB04-057",
  slug: "vegapunk/eb04-057",
  name: "Vegapunk",
  printings: [
    {
      id: "EB04-057",
      artId: "EB04-057",
      setCode: "EB04",
      collectorNumber: "057",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB04-057_217902r.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "EB04",
  cost: 2,
  power: 0,
  counter: 1000,
  traits: ["Scientist Ohara"],
  attribute: "wisdom",
  effect:
    "If you have 2 or less Life cards, all of your yellow {Scientist} type Characters cannot be removed from the field by your opponent's effects.\n[DON!! x1] This Character gains [Blocker].",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            keyword: "blocker",
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: eb04Vegapunk057I18n,
};
