import type { CharacterCard } from "@tcg/op-types";
import { op04Olin099I18n } from "./099-olin.i18n.ts";

export const op04Olin099: CharacterCard = {
  id: "OP04-099",
  canonicalId: "OP04-099",
  slug: "olin",
  name: "Olin",
  printings: [
    {
      id: "OP04-099",
      artId: "OP04-099",
      setCode: "OP04",
      collectorNumber: "099",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-099.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "OP04",
  cost: 7,
  power: 7000,
  traits: ["Land of Wano The Four Emperors Big Mom Pirates"],
  attribute: "special",
  effect:
    "Also treat this card's name as [Charlotte Linlin] according to the rules. [Trigger] If you have 1 or less Life cards, play this card.",
  effects: {
    effects: [
      {
        trigger: "trigger",
        conditions: [
          {
            condition: "lifeCount",
            player: "self",
            comparison: "lte",
            value: 1,
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
          },
        ],
      },
    ],
  },
  i18n: op04Olin099I18n,
};
