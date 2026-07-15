import type { CharacterCard } from "@tcg/op-types";
import { eb03Isuka022I18n } from "./022-isuka.i18n.ts";

export const eb03Isuka022: CharacterCard = {
  id: "EB03-022",
  canonicalId: "EB03-022",
  slug: "isuka/eb03-022",
  name: "Isuka",
  printings: [
    {
      id: "EB03-022",
      artId: "EB03-022",
      setCode: "EB03",
      collectorNumber: "022",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB03-022_fSaKtfP.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "EB03",
  cost: 6,
  power: 6000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "slash",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)\n[On Play] Place up to 1 Character with a cost of 4 or less at the bottom of the owner's deck.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "returnToDeck",
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
                  value: 4,
                },
              ],
            },
            position: "bottom",
          },
        ],
      },
    ],
  },
  i18n: eb03Isuka022I18n,
};
