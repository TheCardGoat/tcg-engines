import type { CharacterCard } from "@tcg/op-types";
import { eb02TrafalgarLaw045I18n } from "./045-trafalgar-law.i18n.ts";

export const eb02TrafalgarLaw045: CharacterCard = {
  id: "EB02-045",
  canonicalId: "EB02-045",
  slug: "trafalgar-law/eb02-045",
  name: "Trafalgar Law",
  printings: [
    {
      id: "EB02-045",
      artId: "EB02-045",
      setCode: "EB02",
      collectorNumber: "045",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB02-045.jpg",
    },
    {
      id: "EB02-045_p1",
      artId: "EB02-045_p1",
      setCode: "EB02",
      collectorNumber: "045",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB02-045_p1.png",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "EB02",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Heart Pirates Supernovas Dressrosa"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB02-045_p1.png",
      imageId: "EB02-045_p1",
    },
  ],
  effect:
    "[Blocker]\n[On Play] You may place 2 cards from your trash at the bottom of your deck in any order: Choose one:\n• Draw 1 card.\n• If your opponent has 5 or more cards in their hand, your opponent trashes 1 card from their hand.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "returnTrashToDeck",
            amount: 2,
            position: "bottom",
          },
        ],
        actions: [
          {
            action: "choice",
            options: [
              [
                {
                  action: "draw",
                  player: "self",
                  amount: 1,
                },
              ],
              [
                {
                  action: "trashFromHand",
                  player: "opponent",
                  amount: 1,
                  condition: {
                    condition: "handCount",
                    player: "opponent",
                    comparison: "gte",
                    value: 5,
                  },
                },
              ],
            ],
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: eb02TrafalgarLaw045I18n,
};
