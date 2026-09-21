import type { CharacterCard } from "@tcg/op-types";
import { op15Goro065I18n } from "./op15-065-goro.i18n.ts";

export const op15Goro065: CharacterCard = {
  id: "OP15-065",
  canonicalId: "OP15-065",
  slug: "goro/op15-065",
  name: "Goro",
  printings: [
    {
      id: "OP15-065",
      artId: "OP15-065",
      setCode: "OP15",
      collectorNumber: "065",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-065_6OiXDZB.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP15",
  cost: 3,
  power: 0,
  counter: 2000,
  traits: ["Alabasta Hot Springs Island"],
  attribute: "wisdom",
  effect:
    "[On Play] Reveal 1 card from the top of your deck. If the revealed card has a cost of 2 or less, add up to 1 DON!! card from your DON!! deck and rest it.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "revealFromDeck",
            player: "self",
            count: 1,
            ifRevealedCardMatches: {
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 2,
                },
              ],
              actions: [
                {
                  action: "addDon",
                  count: {
                    amount: 1,
                    upTo: true,
                  },
                  state: "rested",
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op15Goro065I18n,
};
