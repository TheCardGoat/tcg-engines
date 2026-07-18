import type { CharacterCard } from "@tcg/op-types";
import { op03Lim015I18n } from "./015-lim.i18n.ts";

export const op03Lim015: CharacterCard = {
  id: "OP03-015",
  canonicalId: "OP03-015",
  slug: "lim/op03-015",
  name: "Lim",
  printings: [
    {
      id: "OP03-015",
      artId: "OP03-015",
      setCode: "OP03",
      collectorNumber: "015",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-015.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP03",
  cost: 3,
  power: 2000,
  traits: ["ODYSSEY"],
  attribute: "wisdom",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)\n[Opponent's Turn] When this Character is K.O.'d, give up to 1 of your opponent's Leader or Character cards −2000 power during this turn.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onKo",
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -2000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op03Lim015I18n,
};
