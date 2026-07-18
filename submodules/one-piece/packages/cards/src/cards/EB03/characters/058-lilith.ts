import type { CharacterCard } from "@tcg/op-types";
import { eb03Lilith058I18n } from "./058-lilith.i18n.ts";

export const eb03Lilith058: CharacterCard = {
  id: "EB03-058",
  canonicalId: "EB03-058",
  slug: "lilith/eb03-058",
  name: "Lilith",
  printings: [
    {
      id: "EB03-058",
      artId: "EB03-058",
      setCode: "EB03",
      collectorNumber: "058",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB03-058_AqSYCG2.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "EB03",
  cost: 5,
  power: 6000,
  counter: 1000,
  trigger: "If your Leader is [Vegapunk], play this card.",
  traits: ["Scientist Egghead"],
  attribute: "wisdom",
  effect: "[Your Turn] [On Play] If you have 2 or less Life cards, draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
          {
            condition: "lifeCount",
            player: "self",
            comparison: "lte",
            value: 2,
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
      },
      {
        trigger: "trigger",
        conditions: [
          {
            condition: "leaderName",
            name: "Vegapunk",
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
            },
            self: true,
          },
        ],
      },
    ],
  },
  i18n: eb03Lilith058I18n,
};
