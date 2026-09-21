import type { CharacterCard } from "@tcg/op-types";
import { op16Usopp043I18n } from "./op16-043-usopp.i18n.ts";

export const op16Usopp043: CharacterCard = {
  id: "OP16-043",
  canonicalId: "OP16-043",
  slug: "usopp/op16-043",
  name: "Usopp",
  printings: [
    {
      id: "OP16-043",
      artId: "OP16-043",
      setCode: "OP16",
      collectorNumber: "043",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-043_Q3Lbfck.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP16",
  cost: 2,
  power: 1000,
  counter: 1000,
  traits: ["Straw Hat Crew Dressrosa"],
  attribute: "ranged",
  effect:
    "[Blocker]\n\n[On K.O.] Return up to 1 of tour opponent's Characters with a cost of 5 or less to the owner's hand.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onKo",
        actions: [
          {
            action: "returnToHand",
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
                  value: 5,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op16Usopp043I18n,
};
