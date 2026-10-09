import type { CharacterCard } from "@tcg/op-types";
import { st05Uta004I18n } from "./st05-004-uta.i18n.ts";

export const st05Uta004: CharacterCard = {
  id: "ST05-004",
  canonicalId: "ST05-004",
  slug: "uta/st05-004",
  name: "Uta",
  printings: [
    {
      id: "ST05-004",
      artId: "ST05-004",
      setCode: "ST05",
      collectorNumber: "004",
      rarity: "SR",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST05-004.png",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "ST05",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["FILM"],
  attribute: "special",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On Block] DON!! −1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Rest up to 1 of your opponent's Characters with a cost of 5 or less.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onBlock",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
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
                  value: 5,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: st05Uta004I18n,
};
