import type { CharacterCard } from "@tcg/op-types";
import { op17CharlotteBrulee108I18n } from "./op17-108-charlotte-brulee.i18n.ts";

export const op17CharlotteBrulee108: CharacterCard = {
  id: "OP17-108",
  canonicalId: "OP17-108",
  slug: "charlotte-brulee/op17-108",
  name: "Charlotte Brulee",
  printings: [
    {
      id: "OP17-108",
      artId: "OP17-108",
      setCode: "OP17",
      collectorNumber: "108",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-108_xysGbOb.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP17",
  cost: 3,
  power: 4000,
  counter: 1000,
  trigger: "Rest up to 1 of your opponent's Characters with a cost of 6 or less.",
  traits: ["Big Mom Pirates"],
  attribute: "special",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "trigger",
        actions: [
          {
            action: "rest",
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
                  value: 6,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op17CharlotteBrulee108I18n,
};
