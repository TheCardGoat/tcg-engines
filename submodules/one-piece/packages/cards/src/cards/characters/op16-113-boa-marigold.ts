import type { CharacterCard } from "@tcg/op-types";
import { op16BoaMarigold113I18n } from "./op16-113-boa-marigold.i18n.ts";

export const op16BoaMarigold113: CharacterCard = {
  id: "OP16-113",
  canonicalId: "OP16-113",
  slug: "boa-marigold/op16-113",
  name: "Boa Marigold",
  printings: [
    {
      id: "OP16-113",
      artId: "OP16-113",
      setCode: "OP16",
      collectorNumber: "113",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-113_8vbsbG3.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP16",
  cost: 5,
  power: 5000,
  counter: 1000,
  trigger: "If your Leader has the {Kuja Pirates} type, play this card.",
  traits: ["Kuja Pirates"],
  attribute: "slash",
  effect: "If you have 2 or less Life cards, this Character gains [Blocker].",
  effects: {
    effects: [
      {
        trigger: "trigger",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Kuja Pirates",
            match: "includes",
          },
        ],
        actions: [
          {
            action: "playThisCard",
          },
        ],
      },
    ],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "lifeCount",
            player: "self",
            comparison: "lte",
            value: 2,
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
  i18n: op16BoaMarigold113I18n,
};
