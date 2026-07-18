import type { CharacterCard } from "@tcg/op-types";
import { op10Violet062I18n } from "./062-violet.i18n.ts";

export const op10Violet062: CharacterCard = {
  id: "OP10-062",
  canonicalId: "OP10-062",
  slug: "violet",
  name: "Violet",
  printings: [
    {
      id: "OP10-062",
      artId: "OP10-062",
      setCode: "OP10",
      collectorNumber: "062",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-062.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP10",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Donquixote Pirates"],
  attribute: "special",
  effect:
    '[Blocker]\n[On K.O.] DON!! −1: If your Leader has the "Donquixote Pirates" type, add up to 1 purple Event from your trash to your hand.',
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onKo",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
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
                  filter: "color",
                  value: "purple",
                },
                {
                  filter: "cardCategory",
                  value: "event",
                },
              ],
            },
            condition: {
              condition: "leaderTrait",
              trait: "Donquixote Pirates",
              match: "includes",
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op10Violet062I18n,
};
