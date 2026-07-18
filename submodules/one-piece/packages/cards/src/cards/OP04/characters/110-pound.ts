import type { CharacterCard } from "@tcg/op-types";
import { op04Pound110I18n } from "./110-pound.i18n.ts";

export const op04Pound110: CharacterCard = {
  id: "OP04-110",
  canonicalId: "OP04-110",
  slug: "pound",
  name: "Pound",
  printings: [
    {
      id: "OP04-110",
      artId: "OP04-110",
      setCode: "OP04",
      collectorNumber: "110",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-110.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP04",
  cost: 3,
  power: 3000,
  counter: 1000,
  traits: ["Whole Cake Island"],
  attribute: "wisdom",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On K.O.] Add up to 1 of your opponent's Characters with a cost of 3 or less to the top or bottom of your opponent's Life cards face-up.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onKo",
        actions: [
          {
            action: "addToLife",
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
                  value: 3,
                },
              ],
            },
            position: "choice",
            faceUp: true,
          },
        ],
      },
    ],
  },
  i18n: op04Pound110I18n,
};
